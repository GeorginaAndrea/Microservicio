
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';

export class LibroService{
    constructor(){
        this.baseUrl = "http://localhost:8081/libros/"
    }

    getAll() {
        return new Promise((resolve, reject) => {
          axios.get(this.baseUrl + "all")
            .then(response => {
                console.log(response);
              resolve(response.data);
            })
            .catch(error => {
              reject(error);
            });
        });
    }
}