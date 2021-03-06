/**
 * Attendee
 * Gives all the details of the attendee
 *
 * OpenAPI spec version: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

import { Inject, Injectable, Optional } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { RequestMethod, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Response, ResponseContentType } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import * as models from '../model/models';
import { BASE_PATH, COLLECTION_FORMATS } from '../variables';
import { Configuration } from '../configuration';

/* tslint:disable:no-unused-variable member-ordering */


@Injectable()
export class AttendeeApi {
    protected basePath = 'http://localhost:8081/api';
    public defaultHeaders: Headers = new Headers();
    public configuration: Configuration = new Configuration();
    public links: { [key: string]: string; } = {};

    public getResponse(body: any): any {
        if (!body.data)
            return body;

        if (body.links) {
            this.links = {};
            for (let key in body.links) {
                this.links[key] = body.links[key] !== undefined ? body.links[key] : null;
            }
        }
        return body.data;
    }

    constructor(protected http: Http, @Optional() @Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
        }

        this.basePath += '/conference-attendee/api';
    }

    /**
     * Adds a new attendee to the conference
     * 
     * @param body Room to be created
     */
    public add(body: models.Attendee, extraHttpRequestParams?: any): Observable<{}> {
        return this.addWithHttpInfo(body, extraHttpRequestParams)
            .map((response: Response) => {
                if (response.status === 204) {
                    return undefined;
                } else {
                    return this.getResponse(response.json());
                }
            });
    }

    /**
     * Finds all the attendees
     * 
     * @param page 
     */
    public allAttendees(page?: number, extraHttpRequestParams?: any): Observable<Array<models.Attendee>> {
        return this.allAttendeesWithHttpInfo(page, extraHttpRequestParams)
            .map((response: Response) => {
                if (response.status === 204) {
                    return undefined;
                } else {
                    return this.getResponse(response.json());
                }
            });
    }

    /**
     * Logs an attendee with a user and password
     * 
     * @param login 
     * @param password 
     */
    public authenticateUser(login?: string, password?: string, extraHttpRequestParams?: any): Observable<{}> {
        return this.authenticateUserWithHttpInfo(login, password, extraHttpRequestParams)
            .map((response: Response) => {
                if (response.status === 204) {
                    return undefined;
                } else {
                    return this.getResponse(response.json());
                }
            });
    }

    /**
     * Deletes an attendee
     * 
     * @param id 
     */
    public remove(id: string, extraHttpRequestParams?: any): Observable<{}> {
        return this.removeWithHttpInfo(id, extraHttpRequestParams)
            .map((response: Response) => {
                if (response.status === 204) {
                    return undefined;
                } else {
                    return this.getResponse(response.json());
                }
            });
    }

    /**
     * Finds an attendee by ID
     * 
     * @param id 
     */
    public retrieve(id: string, extraHttpRequestParams?: any): Observable<models.Attendee> {
        return this.retrieveWithHttpInfo(id, extraHttpRequestParams)
            .map((response: Response) => {
                if (response.status === 204) {
                    return undefined;
                } else {
                    return this.getResponse(response.json());
                }
            });
    }


    /**
     * Adds a new attendee to the conference
     * 
     * @param body Room to be created
     */
    public addWithHttpInfo(body: models.Attendee, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + `/attendees`;

        let queryParameters = new URLSearchParams();
        let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'body' is not null or undefined
        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling add.');
        }
        // to determine the Content-Type header
        let consumes: string[] = [
            'application/json'
        ];

        // to determine the Accept header
        let produces: string[] = [
            'application/json'
        ];

        headers.set('Content-Type', 'application/json');

        let requestOptions: RequestOptionsArgs = new RequestOptions({
            method: RequestMethod.Post,
            headers: headers,
            body: body == null ? '' : JSON.stringify(body), // https://github.com/angular/angular/issues/10612
            search: queryParameters
        });

        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
        }

        return this.http.request(path, requestOptions);
    }

    /**
     * Finds all the attendees
     * 
     * @param page 
     */
    public allAttendeesWithHttpInfo(page?: number, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + `/attendees`;

        let queryParameters = new URLSearchParams();
        let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        if (page !== undefined) {
            if (<any>page instanceof Date) {
                queryParameters.set('page', (<any>page).d.toISOString());
            } else {
                queryParameters.set('page', <any>page);
            }
        }

        // to determine the Content-Type header
        let consumes: string[] = [
            'application/json'
        ];

        // to determine the Accept header
        let produces: string[] = [
            'application/json'
        ];

        let requestOptions: RequestOptionsArgs = new RequestOptions({
            method: RequestMethod.Get,
            headers: headers,
            search: queryParameters
        });

        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
        }

        return this.http.request(path, requestOptions);
    }

    /**
     * Logs an attendee with a user and password
     * 
     * @param login 
     * @param password 
     */
    public authenticateUserWithHttpInfo(login?: string, password?: string, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + `/attendees/login`;

        let queryParameters = new URLSearchParams();
        let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        let formParams = new URLSearchParams();

        // to determine the Content-Type header
        let consumes: string[] = [
            'application/x-www-form-urlencoded'
        ];

        // to determine the Accept header
        let produces: string[] = [
            'application/json'
        ];

        headers.set('Content-Type', 'application/x-www-form-urlencoded');

        if (login !== undefined) {
            formParams.set('login', <any>login);
        }

        if (password !== undefined) {
            formParams.set('password', <any>password);
        }

        let requestOptions: RequestOptionsArgs = new RequestOptions({
            method: RequestMethod.Post,
            headers: headers,
            body: formParams.toString(),
            search: queryParameters
        });

        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
        }

        return this.http.request(path, requestOptions);
    }

    /**
     * Deletes an attendee
     * 
     * @param id 
     */
    public removeWithHttpInfo(id: string, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + `/attendees/${id}`;

        let queryParameters = new URLSearchParams();
        let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling remove.');
        }
        // to determine the Content-Type header
        let consumes: string[] = [
            'application/json'
        ];

        // to determine the Accept header
        let produces: string[] = [
            'application/json'
        ];

        let requestOptions: RequestOptionsArgs = new RequestOptions({
            method: RequestMethod.Delete,
            headers: headers,
            search: queryParameters
        });

        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
        }

        return this.http.request(path, requestOptions);
    }

    /**
     * Finds an attendee by ID
     * 
     * @param id 
     */
    public retrieveWithHttpInfo(id: string, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + `/attendees/${id}`;

        let queryParameters = new URLSearchParams();
        let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling retrieve.');
        }
        // to determine the Content-Type header
        let consumes: string[] = [
            'application/json'
        ];

        // to determine the Accept header
        let produces: string[] = [
            'application/json'
        ];

        let requestOptions: RequestOptionsArgs = new RequestOptions({
            method: RequestMethod.Get,
            headers: headers,
            search: queryParameters
        });

        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
        }

        return this.http.request(path, requestOptions);
    }

}
