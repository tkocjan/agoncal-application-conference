package org.agoncal.application.conference.talk.rest;

import org.agoncal.application.conference.commons.rest.CORSFilterTest;
import org.agoncal.application.conference.talk.domain.Speaker;
import org.agoncal.application.conference.talk.domain.Talk;
import org.agoncal.application.conference.talk.domain.Talks;
import org.agoncal.application.conference.talk.repository.TalkRepository;
import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.extension.rest.client.ArquillianResteasyResource;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.junit.InSequence;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.asset.EmptyAsset;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.jboss.shrinkwrap.resolver.api.maven.Maven;
import org.junit.Test;
import org.junit.runner.RunWith;

import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.EntityTag;
import javax.ws.rs.core.Response;
import java.io.File;
import java.io.StringReader;
import java.util.Arrays;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON_TYPE;
import static javax.ws.rs.core.Response.Status.*;
import static org.agoncal.application.conference.commons.domain.Links.COLLECTION;
import static org.agoncal.application.conference.commons.domain.Links.SELF;
import static org.agoncal.application.conference.commons.domain.Links.SWAGGER;
import static org.junit.Assert.*;

@RunWith(Arquillian.class)
@RunAsClient
public class TalkEndpointTest {

    // ======================================
    // =             Attributes             =
    // ======================================

    private static final Talk TEST_TALK = new Talk("title", "language", "talk type", "track", "summary");
    private static final Speaker TEST_SPEAKER = new Speaker("id", "name");
    private static String talkId;

    // ======================================
    // =         Deployment methods         =
    // ======================================

    @Deployment(testable = false)
    public static WebArchive createDeployment() {

        // Import Maven runtime dependencies
        File[] files = Maven.resolver().loadPomFromFile("pom.xml")
            .importRuntimeDependencies().resolve().withTransitivity().asFile();

        return ShrinkWrap.create(WebArchive.class)
            .addClasses(Talk.class, Talks.class, Speaker.class, TalkEndpoint.class, TalkRepository.class, Application.class)
            .addAsResource("META-INF/persistence-test.xml", "META-INF/persistence.xml")
            .addAsWebInfResource(EmptyAsset.INSTANCE, "beans.xml")
            .addAsLibraries(files);
    }

    // ======================================
    // =            Test methods            =
    // ======================================

    @Test
    @InSequence(1)
    public void shouldFailGetingTalksWithZeroPage(@ArquillianResteasyResource("api/talks") WebTarget webTarget) throws Exception {
        Response response = webTarget.queryParam("page", 0).request(APPLICATION_JSON_TYPE).get();
        assertEquals(BAD_REQUEST.getStatusCode(), response.getStatus());
        checkHeaders(response);
    }

    @Test
    @InSequence(2)
    public void shouldGetNoTalks(@ArquillianResteasyResource("api/talks") WebTarget webTarget) throws Exception {
        Response response = webTarget.request(APPLICATION_JSON_TYPE).get();
        assertEquals(NOT_FOUND.getStatusCode(), response.getStatus());
        checkHeaders(response);
    }

    @Test
    @InSequence(3)
    public void shouldFailCreatingInvalidTalk(@ArquillianResteasyResource("api/talks") WebTarget webTarget) throws Exception {
        Response response = webTarget.request(APPLICATION_JSON_TYPE).post(null);
        assertEquals(UNSUPPORTED_MEDIA_TYPE.getStatusCode(), response.getStatus());
        checkHeaders(response);
    }

    @Test
    @InSequence(4)
    public void shouldCreateTalk(@ArquillianResteasyResource("api/talks") WebTarget webTarget) throws Exception {
        TEST_TALK.setSpeakers(Arrays.asList(TEST_SPEAKER));
        Response response = webTarget.request(APPLICATION_JSON_TYPE).post(Entity.entity(TEST_TALK, APPLICATION_JSON_TYPE));
        assertEquals(CREATED.getStatusCode(), response.getStatus());
        talkId = getSpeakerId(response);
        checkHeaders(response);
    }

    @Test
    @InSequence(5)
    public void shouldGetAlreadyCreatedTalk(@ArquillianResteasyResource("api/talks") WebTarget webTarget) throws Exception {
        Response response = webTarget.path(talkId).request(APPLICATION_JSON_TYPE).get();
        assertEquals(OK.getStatusCode(), response.getStatus());
        JsonObject jsonObject = readJsonContent(response);
        assertEquals("Should have 8 attributes", 8, jsonObject.size());
        assertEquals(talkId, jsonObject.getString("id"));
        assertEquals("Should have 3 links", 3, jsonObject.getJsonObject("links").size());
        assertTrue(jsonObject.getJsonObject("links").getString(SWAGGER).contains("swagger.json"));
        assertTrue(jsonObject.getJsonObject("links").getString(SELF).contains("/api/talks/" + talkId));
        assertTrue(jsonObject.getJsonObject("links").getString(COLLECTION).contains("/api/talks"));
        assertEquals(TEST_TALK.getTitle(), jsonObject.getString("title"));
        assertEquals(TEST_TALK.getLanguage(), jsonObject.getString("language"));
        assertEquals(TEST_TALK.getTalkType(), jsonObject.getString("talkType"));
        assertEquals(TEST_TALK.getTrack(), jsonObject.getString("track"));
        assertEquals(TEST_TALK.getSummary(), jsonObject.getString("summary"));
        assertEquals("Should have 1 speaker", 1, jsonObject.getJsonArray("speakers").size());
        assertEquals(TEST_SPEAKER.getId(), jsonObject.getJsonArray("speakers").getJsonObject(0).getString("id"));
        assertEquals(TEST_SPEAKER.getName(), jsonObject.getJsonArray("speakers").getJsonObject(0).getString("name"));
        assertEquals("Should have 1 link", 1, jsonObject.getJsonArray("speakers").getJsonObject(0).getJsonObject("links").size());
        checkHeaders(response);
    }

    @Test
    @InSequence(6)
    public void shouldGetCreatedTalkWithEtag(@ArquillianResteasyResource("api/talks") WebTarget webTarget) throws Exception {
        Response response = webTarget.path(talkId).request(APPLICATION_JSON_TYPE).get();
        EntityTag etag = response.getEntityTag();
        assertNotNull(etag);
        assertEquals(OK.getStatusCode(), response.getStatus());
        response.close();
        Response response2 = webTarget.path(talkId).request(APPLICATION_JSON_TYPE).header("If-None-Match", etag).get();
        assertNotNull(response2.getEntityTag());
        assertEquals(NOT_MODIFIED.getStatusCode(), response2.getStatus());
        checkHeaders(response);
    }

    @Test
    @InSequence(7)
    public void shouldCheckCollectionOfTalks(@ArquillianResteasyResource("api/talks") WebTarget webTarget) throws Exception {
        Response response = webTarget.request(APPLICATION_JSON_TYPE).get();
        assertEquals(OK.getStatusCode(), response.getStatus());
        JsonObject jsonObject = readJsonContent(response);
        assertEquals("Should have 6 links", 6, jsonObject.getJsonObject("links").size());
        assertEquals("Should have 1 talk", 1, jsonObject.getJsonArray("data").size());
        checkHeaders(response);
    }

    @Test
    @InSequence(8)
    public void shouldRemoveTalk(@ArquillianResteasyResource("api/talks") WebTarget webTarget) throws Exception {
        Response response = webTarget.path(talkId).request(APPLICATION_JSON_TYPE).delete();
        assertEquals(NO_CONTENT.getStatusCode(), response.getStatus());
        Response checkResponse = webTarget.path(talkId).request(APPLICATION_JSON_TYPE).get();
        assertEquals(NOT_FOUND.getStatusCode(), checkResponse.getStatus());
        checkHeaders(response);
    }

    @Test
    @InSequence(9)
    public void shouldRemoveWithInvalidInput(@ArquillianResteasyResource("api/talks") WebTarget webTarget) throws Exception {
        Response response = webTarget.request(APPLICATION_JSON_TYPE).delete();
        assertEquals(METHOD_NOT_ALLOWED.getStatusCode(), response.getStatus());
        checkHeaders(response);
    }

    // ======================================
    // =           Private methods          =
    // ======================================

    private String getSpeakerId(Response response) {
        String location = response.getHeaderString("location");
        return location.substring(location.lastIndexOf("/") + 1);
    }

    private static JsonObject readJsonContent(Response response) {
        JsonReader jsonReader = readJsonStringFromResponse(response);
        return jsonReader.readObject();
    }

    private static JsonReader readJsonStringFromResponse(Response response) {
        String competitionJson = response.readEntity(String.class);
        StringReader stringReader = new StringReader(competitionJson);
        return Json.createReader(stringReader);
    }

    private void checkHeaders(Response response) {
        CORSFilterTest.checkCORSHeaders(response);
    }
}
