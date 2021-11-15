import { HttpParams } from '@angular/common/http';
import {  Component, ViewChild } from '@angular/core';
import { PageObject, PaginationUtils } from 'blazing';
import { BaseComponent } from '../../../../shared/base/base.component';
import { ICliente , IClienteDto } from '../cliente.interface';
import { ClienteApiService } from '../cliente-api.service';
import { ButtonService } from '../../../../utilities/services/buttons.service';
import { SearchClienteComponent } from './search-cliente/search-cliente.component';
import { Router } from '@angular/router';
import { extractResponse, extractTotalPages, navigateToPath, getPrivilegesEnum, getPrivileges } from 'voila2-runtime-ng';


@Component({
  selector: 'app-list-cliente',
  templateUrl: './list-cliente.component.html',
  styleUrls: ['./list-cliente.component.scss'],
  providers:  [ClienteApiService, ButtonService]
})
export class ListClienteComponent extends BaseComponent<ICliente,IClienteDto>  {


  public clienteList: ICliente [] =  [];
  public cliente!: ICliente;
  public totalPages: number = 0;
  public spinner: boolean = true;
  public clienteCriteria !: any;
  public pageSize: number = 5;

  public privileges: string[] = getPrivileges();
  
  public get Privileges(): any {
    return  getPrivilegesEnum(); 
  }
 

  @ViewChild(SearchClienteComponent)  searchCliente !: SearchClienteComponent;
  

  constructor(
    private clienteApiService: ClienteApiService,
    public router: Router,
  ) { super() }

  
  public paginateTable(object: any, criteria?: any): void {
   // const options: HttpParams = PaginationUtils.setOptionsForSpring(object, criteria);
    this.clienteApiService.getClienteByCriteria().subscribe(
      (data) => {
        console.log("Data.... ", data)
        this.clienteList = extractResponse('cliente', data);
        this.totalPages = extractTotalPages(data);
        this.spinner = false;
      },
      () => {
        this.spinner = false;
      }
    )

  }

  public searchWithCriteria() : void {
	this.clienteCriteria = this.searchCliente.search();
     const object: PageObject  = { page: 0, pageSize: this.pageSize};
     this.paginateTable(object, this.clienteCriteria);
  }


  public navigateToView(id: number) : void {
   navigateToPath('/pages/ms-demo/cliente/detail-cliente/' + id + '/view', this.router);
  }

	

}

