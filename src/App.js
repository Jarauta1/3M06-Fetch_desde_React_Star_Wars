/* import './App.css';
import {useEffect, useState} from "react"

let url ="http://swapi.dev/api/planets/"

function App() {

    let [data,setData] = useState([])
    let [dataResidentes,setDataResidentes] = useState([])
    let [num,setNum] = useState(0)
    let [personajes,setPersonajes] = useState(0)
    let [planeta,setPlaneta] = useState("")
    let [isLoading,setIsloading] = useState(false)
    let [page,setPage] = useState([])

    useEffect(function(){
        setIsloading(true)
        fetch(url).then(respuesta=>respuesta.json()).then(datos=>{
            setPage(datos)
            setData(datos.results)
            setIsloading(false)
        })
    },[num])
    
    function anterior() {
        if (page.previous != null) {
            url = page.previous
            setNum(num-1)}
        }
        
    function siguiente() {
        if (page.next != null) {
            url = page.next
            setNum(num+1)
        }
    }
        
    function planetaElegido(e) {
        setPlaneta(e.target.value)
        setPersonajes(personajes+1)
    }
    
    useEffect(function(){
        fetch(planeta).then(respuesta=>respuesta.json()).then(datos=>{
            setDataResidentes(datos.residents)
            for (let i=0;)
        })
    },[personajes])
      

    let mostrarPlanetas = data.map(planeta=>{
        return <option value={planeta.url}>{planeta.name}</option>
    })

    if (isLoading) {
        return <div>Loading...</div>
    } else {
        return (<>
            <button onClick={anterior}>Anterior</button>
            <button onClick={siguiente}>Siguiente</button>
            <select id="eleccion" onChange={planetaElegido} name="select">
                <option value="--">--</option>
                {mostrarPlanetas}
            </select>
            
        </>);
    }
}

export default App;
 */


import "./App.css"
import {useState, useEffect} from "react"

//El componente Residentes recibe unos props
const Residentes = (props) => {
  //Creamos la variable de estado "data" donde guardaremos la respuesta del fetch
  const [data, setData] = useState([]);
  useEffect(() => {
    //dentro del useEffect hacemos el fetch. Pero en este caso no tenemos sólo una url. Si no que tenemos un array de urls.
    //Por lo que tenemos que usar el Promise.all() Que esperará a que todas las respuestas (de las distintas urls) estén resueltas para pasar al siguiente .then()

    //Promise.all recibe una función map por parametros que recorrerá todo el array de urls. El map hará un fetch a cada url que hay en el array. Una por cada vuelta que de.
    Promise.all(props.residents.map((url) => fetch(url)))
      //En el siguiente .then() como nos llega un array de objetos JSON necesitamos otro Promise.all para que el siguiente .then espere
      //a que haya accedido y parseado TODAS las respuestas que nos llegan del fetch.
      //Dentro de este Promis.all hacemos otro map que recorra ese array de objetos JSON y por cada vuelta el map devuelve esa respuesta parseada.
      .then((respuesta) => Promise.all(respuesta.map((res) => res.json())))

      //Una vez se hayan resuelto todas las promesas, en el siguiente .then() nos llegará como resultado un array con todas las promesas resueltas
      .then((res) => {
        //guardamos en la variable de estado "data" el array de respuestas.
        setData(res);
      });
    //Como queremos que el useEffect se repita cada vez que el array de urls cambie, le ponemos en el array que recibe por parametros ese mismo array que nos llega por props
  }, [props.residents]);
  //Guardamos en una variable lo que nos devuelve el map que le hacemos a data (variable de estado)
  const personajes = data.map((personaje) => {
    //el map devuelve un parrafo con el nombre de los personajes
    return <p>{personaje.name}</p>;
  });

  //El componente Residentes devuelve la variable personajes donde tenemos guardados todos esos parrafos con los nombres
  return <div>{personajes}</div>;
};

//el componente InfoPlaneta recibe unos props
const InfoPlaneta = (props) => {
  //Creamos una variable de estado donde guardaremos el array de residentes que nos llega dentro de la respuesta del fetch
  const [residents, setResidents] = useState([]);

  useEffect(() => {
    //dentro del useEffect hacemo fetch a la url que nos llega por props. Estos props nos los has pasado el componente App
    fetch(props.url)
      .then((res) => res.json())
      .then((res) => {
        //guardamos en la variable de estado el array de residentes que nos llega en la respuesta
        setResidents(res.residents);
      });

    //useEffect a parte de recibir por parametros la función que hace el fetch recibe también un array.
    //en este caso, como queremos que useEffect se ejecute cada cez que llega una url nueva por props, dentro del array ponemos "props.url" (que así es como nos llega la url por props)
  }, [props.url]);
  return <Residentes residents={residents} />;
};

function App() {
  //Creamos dos estados. Uno para guardar la información que traerá la API y el otro para guardar
  //la URL que pasaremos al componente hijo

  const [data, setData] = useState([]);
  const [url, setUrl] = useState("");

  useEffect(() => {
    //dentro del useEffect hacemos fetch a la API de StarWars
    fetch("https://swapi.dev/api/planets")
      .then((res) => res.json())
      .then((res) => {
        //una vez resuelta la promesa guardamos en la variable de estado "data" el array
        //con los resultados que nos llegan
        setData(res.results);
      });

    //el useEffect a parte de recibir la función que hace el fetch, recibe también un array. En este caso vaciío porque solo queremos que se ejecute una vez
  }, []);

  //Creamos una función que recibirá un evento como parametro
  const handleChange = (e) => {
    //guardamos en la variable de estado "url" la url a la que haremos fetch con el valor del evento añadido
    setUrl("https://swapi.dev/api/planets/" + e.target.value);
  };

  //Guardamos en la variable options lo que devuelve la función map. A map le pasamos dos parametros.
  //El primero será la "puerta de acceso" a cada indice del array data
  //El segundo será el indice del array por el que va el map.
  const options = data.map((option, index) => {
    //el map devuelve una etiqueta option con valor index + 1. (+ 1 porque viendo la documentación de la API vemos que la url de del primer planeta termina en 1 y no en 0. Y sabemos que el primer indice del array es 0)
    //el contenido de la etiqueta option es el nombre del planeta. "option.name"
    return <option value={index + 1}>{option.name}</option>;
  });

  //El componente App devuelve un select con el evento onChange que llama a la función handleChange creada más arriba
  //y el componente InfoPlaneta al que le pasamos por props la url guardada en la variable de estado url
  return (
    <>
      <select onChange={handleChange}>{options}</select>
      <InfoPlaneta url={url} />
    </>
  );
}

export default App;