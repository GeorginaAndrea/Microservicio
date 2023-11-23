import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TabMenu } from 'primereact/tabmenu';
import 'primereact/resources/themes/soho-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/mdc-dark-indigo/theme.css';
import { Panel } from 'primereact/panel';
import { LibroService } from './service/LibroService';
import { LibroPrestadoService } from './service/LibroPrestadoService';

class App extends Component {
  constructor() {
    super();
    this.state = {
      activeItem: 'Home',
      libros: null,
      prestados: null,
    };

    this.items = [
      { label: 'Home', icon: 'pi pi-fw pi-home', command: () => this.MostrarLibros() },
      { label: 'Libros', icon: 'pi pi-fw pi-calendar', command: () => this.setActiveItem('Libros') },
      { label: 'Prestados', icon: 'pi pi-fw pi-calendar', command: () => this.MostrarPrestados() },
    ];

    this.libroService = new LibroService();
    this.prestadoService = new LibroPrestadoService();
  }

  componentDidMount() {
    this.libroService.getAll()
      .then(data => {
        if (data) {
          console.log(data);
          this.setState({ libros: data });
        } else {
          console.error('La respuesta de getAll es undefined.');
        }
      })
      .catch(error => {
        console.error('Error en la solicitud:', error);
      });
  }

  setActiveItem = (item) => {
    this.setState({ activeItem: item });
  };

  renderContent = () => {
    switch (this.state.activeItem) {
      case 'Libros':
        return this.renderLibros();
      case 'Prestados':
        return this.renderPrestados();
      default:
        return <h1>HOLA MUNDO</h1>;
    }
  };

  renderLibros = () => {
    return (
      <Panel>
        <DataTable
          value={this.state.libros}
          paginator
          showGridlines
          rows={10}
          dataKey="id"
          globalFilterFields={['id', 'titulo', 'autor', 'genero', 'disponibilidad', 'existencias']}
          header="LIBROS"
          emptyMessage="No customers found."
        >
          <Column field="id" header="ID" style={{ minWidth: '12rem' }} />     
          <Column field="titulo" header="TITULO" filter filterPlaceholder="Buscar por nombre" style={{ minWidth: '12rem' }} />
          <Column field="autor" header="AUTOR" filter filterPlaceholder="Buscar por autor" style={{ minWidth: '12rem' }} />
          <Column field="genero" header="GENERO" filter filterPlaceholder="Buscar por genero" style={{ minWidth: '12rem' }} />
          <Column field="disponibilidad" header="DISPONIBILIDAD" filter filterPlaceholder="Buscar por disponibilidad" dataType="numeric" style={{ minWidth: '10rem' }}  />
          <Column field="existencias" header="EXISTENCIAS" dataType="numeric" style={{ minWidth: '10rem' }}  />
          <Column field="precio" header="PRECIO" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }}  />
        </DataTable>
      </Panel>
    );
  };

  renderPrestados = () => {
    return (
      <Panel>
        <DataTable
          value={this.state.prestados}
          paginator
          showGridlines
          rows={10}
          dataKey="id"
          globalFilterFields={['id', 'disponibilidad', 'existencias', 'precio']}
          header="LIBROS PRESTADOS"
          emptyMessage="No customers found."
        >
          <Column field="id" header="ID" style={{ minWidth: '12rem' }} />
          <Column field="disponibilidad" header="DISPONIBILIDAD" filter filterPlaceholder="Buscar por disponibilidad" dataType="numeric" style={{ minWidth: '10rem' }}  />
          <Column field="existencias" header="EXISTENCIAS" dataType="numeric" style={{ minWidth: '10rem' }}  />
          <Column field="precio" header="PRECIO" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }}  />
        </DataTable>
      </Panel>
    );
  };

  MostrarLibros = () => {
    this.libroService.getAll()
      .then(data => {
        if (data) {
          console.log(data);
          this.setState({ libros: data });
        } else {
          console.error('La respuesta de getAll es undefined.');
        }
      })
      .catch(error => {
        console.error('Error en la solicitud:', error);
      });
  };

  MostrarPrestados = () => {
    this.prestadoService.getAll()
      .then(response => {
        console.log('Respuesta de getAll:', response);
  
        const data = response.data;
  
        // Verifica si data es undefined o no es un array
        if (data === undefined || !Array.isArray(data)) {
          console.error('La respuesta de getAll es undefined o no es un array.');
          this.setState({ prestados: null });
          return;
        }
  
        // Imprime la longitud de data para verificar si está vacío
        console.log('Longitud de data:', data.length);
  
        if (data.length > 0) {
          console.log('Datos recibidos', data);
  
          // Mapear los datos para obtener una lista de promesas
          const promises = data.map(item => {
            const libroItem = item.libro;
  
            // Verificar si el objeto libro es válido
            if (!libroItem || typeof libroItem !== 'object') {
              return Promise.resolve(null);
            }
  
            // Llamada a LibroPrestadoService con un objeto de tipo Libro
            return this.prestadoService.getAll(libroItem)
              .then(resultado => {
                // Hacer algo con el resultado si es necesario
                console.log(resultado);
                return {
                  id: resultado.id,
                  titulo: resultado.titulo,
                  autor: resultado.autor,
                  genero: resultado.genero,
                  disponibilidad: resultado.disponibilidad,
                  existencia: resultado.existencias,
                  precio: resultado.precio,
                };
              })
              .catch(error => {
                console.error('Error en la solicitud a LibroPrestadoService:', error);
                // Manejar el error según tus necesidades
                return null;
              });
          });
  
          // Puedes esperar a que todas las promesas se resuelvan usando Promise.all
          Promise.all(promises)
            .then(resultados => {
              // Filtrar resultados para eliminar objetos nulos
              const librosPrestados = resultados.filter(libro => libro !== null);
  
              // Actualizar el estado con los libros prestados
              this.setState({ prestados: librosPrestados });
            })
            .catch(error => {
              console.error('Error al resolver las promesas:', error);
              // Manejar el error según tus necesidades
              this.setState({ prestados: null });
            });
        } else {
          console.error('La respuesta de getAll es un array vacío.');
          this.setState({ prestados: null });
        }
      })
      .catch(error => {
        console.error('Error en la solicitud a LibroPrestadoService:', error);
        this.setState({ prestados: null });
      });
  };
  
  render() {
    return (
      <div header="LISTA DE LIBROS" style={{ width: '95%', marginTop: '2em', margin: '0 auto' }}>
        <div className="card">
          <TabMenu model={this.items} />
        </div>
        {/* Renderizar el contenido basado en el elemento activo */}
        {this.renderContent()}
      </div>
    );
  }
}

export default App;

/**
 * 
 * 
import React, { Component } from 'react';
import { LibroService } from './service/LibroService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TabMenu } from 'primereact/tabmenu';
import 'primereact/resources/themes/soho-light/theme.css'
//import 'primereact/resources/themes/mdc-dark-deeppurple/theme.css'
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/mdc-dark-indigo/theme.css';
import { Panel } from 'primereact/panel';
import { LibroPrestadoService } from './service/LibroPrestadoService';


class App extends Component {
  constructor() {
    super();
    this.state = {
      activeItem: 'Home', // Agregar un estado para controlar el elemento activo
      libros: null, // Inicializar libros como null
      prestados : null,
    };

    this.items = [
      { label: 'Home', icon: 'pi pi-fw pi-home', command: () => this.MostrarLibros() },
      { label: 'Libros', icon: 'pi pi-fw pi-calendar', command: () => this.setActiveItem('Libros') },
      {label:'Prestados', icon: 'pi pi-fw pi-calendar', command: () => this.MostrarPrestados()}
      // ... (otros elementos)
    ];

    this.libroService = new LibroService();
    this.PrestadoService = new LibroPrestadoService();
  }

  componentDidMount() {
    this.libroService.getAll()
      .then(data => {
        if (data) {
          console.log(data);
          this.setState({ libros: data });
        } else {
          console.error('La respuesta de getAll es undefined.');
        }
      })
      .catch(error => {
        console.error('Error en la solicitud:', error);
      });
  }

  // Función para cambiar el elemento activo
  setActiveItem = (item) => {
    this.setState({ activeItem: item });
  };

  // Función para renderizar el contenido basado en el elemento activo
  renderContent = () => {
    switch (this.state.activeItem) {
      case 'Libros':
        return this.renderLibros();
      case 'Prestados':
        return this.renderPrestados();
      // Agregar otros casos según sea necesario
      default:
        return <h1>HOLA MUNDO</h1>; // Página de inicio predeterminada
    }
  };

  renderLibros = () => {
    return (
      <Panel>
        <DataTable
          value={this.state.libros}
          paginator
          showGridlines
          rows={10}
          dataKey="id"
          globalFilterFields={['id', 'titulo', 'autor', 'genero', 'disponibilidad', 'existencias']}
          header="LIBROS"
          emptyMessage="No customers found."
        >
          <Column field="id" header="ID" style={{ minWidth: '12rem' }} />     
          <Column field="titulo" header="TITULO" filter filterPlaceholder="Buscar por nombre" style={{ minWidth: '12rem' }} />
          <Column field="autor" header="AUTOR" filter filterPlaceholder="Buscar por autor" style={{ minWidth: '12rem' }} />
          <Column field="genero" header="GENERO" filter filterPlaceholder="Buscar por genero" style={{ minWidth: '12rem' }} />
          <Column field="disponibilidad" header="DISPONIBILIDAD" filter filterPlaceholder="Buscar por disponibilidad" dataType="numeric" style={{ minWidth: '10rem' }}  />
          <Column field="existencias" header="EXISTENCIAS" dataType="numeric" style={{ minWidth: '10rem' }}  />
          <Column field="precio" header="PRECIO" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }}  />
        </DataTable>
      </Panel>
    );
  };
  
 */