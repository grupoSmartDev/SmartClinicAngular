import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: 'Admin' | 'Support' | 'User' | string;
  profilePicture?: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserAdminService {
  private readonly baseURL = environment.apiUrl + 'Auth';

  constructor(private readonly http: HttpClient) {}

  listar(
    page = 1,
    pageSize = 100,
    filter?: string | null
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (filter?.trim()) {
      params = params.set('filter', filter.trim());
    }

    return this.http.get(`${this.baseURL}/Listar`, { params });
  }

  atualizar(
    id: string,
    payload: Partial<AdminUser>,
    profilePicture?: File | null
  ): Observable<any> {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value !== undefined && value !== null ? (value as any) : '');
    });

    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    return this.http.put(`${this.baseURL}/Update/${id}`, formData);
  }
}
