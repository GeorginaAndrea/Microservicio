
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';

export class LibroPrestadoService{
    constructor(){
        this.baseUrl = "http://localhost:8090/comprado/"
    }

    getAll() {
        return new Promise((resolve, reject) => {
          axios.get(this.baseUrl + "listar")
            .then(response => {
                console.log(response);
              resolve(response.data);
            })
            .catch(error => {
                console.error("Error en la solicitud get all", error);
              reject(error);
            });
        });
    }
}