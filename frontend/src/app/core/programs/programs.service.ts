import { Injectable,Inject  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProgramsData } from './programs';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {baseUrl } from "../../../environments/environment";
import {  NbAuthService, NbAuthToken, NB_AUTH_OPTIONS } from '@nebular/auth';
import {ErrorService} from '../../shared/errors.service'
@Injectable()
export class ProgramsService  {
  // Base url
  baseurl = baseUrl;
  token: any;


  constructor(private errorService: ErrorService,private http: HttpClient, authService: NbAuthService,@Inject(NB_AUTH_OPTIONS) protected options = {})  {
    authService.onTokenChange()
    .subscribe((token: NbAuthToken) => {
      this.token = null;
      if (token && token.isValid()) {
        this.token = token;
      }
    });
  }


  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  // POST
  getPrograms(platform:any,search:any): Observable<ProgramsData> {

    return this.http
      .get<ProgramsData>(
        this.baseurl + '/programs?name='+platform+'&program='+search,
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorService.errorHandl));
  }
  syncPrograms(): Observable<ProgramsData> {

    return this.http
      .patch<ProgramsData>(
        this.baseurl + '/programs',
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorService.errorHandl));
  }  
}