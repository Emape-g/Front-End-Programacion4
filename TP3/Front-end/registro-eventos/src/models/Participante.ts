export class Participante {
  id: number;
  nombre: string;
  email: string;
  edad: number;
  pais: string;
  modalidad: string;
  tecnologias: string[];
  nivel: string;
  aceptaTerminos: boolean;
  constructor(datos:{
   id: number;
  nombre: string;
  email: string;
  edad: number;
  pais: string;
  modalidad: string;
  tecnologias: string[];
  nivel: string;
  aceptaTerminos: boolean; 
  }){
    this.id = datos.id;
    this.nombre = datos.nombre;
    this.email = datos.email;
    this.edad = datos.edad;
    this.pais = datos.pais;
    this.modalidad = datos.modalidad;
    this.tecnologias = datos.tecnologias;
    this.nivel = datos.nivel;
    this.aceptaTerminos = datos.aceptaTerminos
  }
}