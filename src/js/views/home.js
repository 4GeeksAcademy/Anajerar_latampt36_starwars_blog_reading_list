import React, { useState, useEffect, useContext } from "react";
import { Navigate,useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Navbar } from "../component/navbar";
import rigoImage from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

export const Home = () => {
	//const [ imgIndx, setImgIndx ] = useState([])
	const [ people, setPeople ] = useState([]);
	const [ peopleDetails, setPeopleDetails] = useState([]);
	const [ planetProperties, setPlanetProperties ] = useState([]);
	const [ planetDetails, setPlanetDetails ] = useState([]);
	const [ nextPplPage, setNextPplPage ] = useState(null);
	const [ prevPplPage, setPrevPplPage ] = useState(null);
	const [ nextPltPage, setNextPltPage ] = useState(null);
	const [ prevPltPage, setPrevPltPage ] = useState(null);
	const { store, actions } = useContext(Context);
	const navigate = useNavigate()
	//const [intervalId, setIntervalId] = useState();	

	const getPeopleHeader = async (url) => {
		try{
			const response = await fetch(url,{
				headers:{'content-type':'application/json'}
			})
			const peopleData=await response.json();
			const peopleArray = peopleData.results.map(single => {
				const findFav = store.favList.find((value)=> value==single.uid) // is favorite?
				const fav = findFav? true : false
				return {'uid':single.uid, 'name':single.name, 'gender':'','hairColor':'','eyeColor':'','fav':fav}
			})
			setPeople(peopleArray);
			setNextPplPage(peopleData.next)
			setPrevPplPage(peopleData.previous)
			getPeopleDetails(peopleArray)
			store.totalPeople = peopleData.total_records;
			return peopleData

		} catch { return ({"msg":"error fetching"})}
	}

	const getPlanetHeader = async (url) => {
		try{
			const response = await fetch(url,{
				headers:{'content-type':'application/json'}
			})
			const planetData=await response.json();
			//console.log("this is the planet list:",planetData.results);
			setPlanetProperties(planetData.results);
			setNextPltPage(planetData.next);
			setPrevPltPage(planetData.previous);
			store.totalPeople = planetData.total_records;
			return

		} catch { return ({"msg":"error fetching"})}

	}

	const getPeopleDetails = (people) => {
		
			const peopleArray = people.map((peopleItem, indx)=>{
				const url= `https://www.swapi.tech/api/people/${peopleItem.uid}`

				fetch(url,{
						headers:{}})
				.then (response => {
					if (!response.ok) {
						throw new Error(response.statusText);
						}
						return response.json();	
					})
				.then ( resp => {
					const details=resp;
					console.log('gender:',details.result.properties.gender)
					})
				.catch (error => {console.log('There was an error with the details:'),error})

				})
			return indx
			}

			//const response = await fetch(`https://www.swapi.tech/api/people/${people.uid}`,{
			//	headers:{}
			//})
			//const details = await response.json();
			//console.log('genre:',details.result.properties.gender);
			//setPeopleDetails([...peopleDetails,{'gender':details.result.properties.gender}])
	

	useEffect(()=>{
		getPeopleHeader('https://www.swapi.tech/api/people');
		getPlanetHeader('https://www.swapi.tech/api/planets');
		},[])

	/* useEffect(()=>{
		const getPeopleProp = async(id) => {
			try{
				console.log("trying to fetch")
				const response = await fetch(`https://www.swapi.tech/api/people/${id}`,{
					headers:{}
				})
				//console.log('response:',response,",",response.status)
				const peoplePty=await response.json();
				const properties={"uid":peoplePty.result.uid,
					"name":peoplePty.result.properties.name
					} ;
				//console.log("This is the responsed data:",peoplePty,properties);
				//setPeopleProperties([...peopleProperties,properties]);
				//console.log("This is the people:", peopleProperties);
				return properties
				} catch {
				console.log('Hay error')
				return ({"msg":"error"})
				}
		}


		const buildIdList = async()=>{
			try{
				const response = await fetch('https://www.swapi.tech/api/people',{
					headers:{'content-type':'application/json'}
				})
				const peopleData=await response.json()
				console.log("This is the JSON response:",peopleData.total_records)
				const indexArray = [];
				const peopleArray = [];
				for (let i=1;i<10;i++) {
					indexArray.push(i);
					const people = await getPeopleProp(i);
					peopleArray.push(people)
					//setPeopleProperties([...peopleProperties,properties]);
					setPeopleProperties(peopleArray);
					setImgIndx(indexArray);
					setTimeout(() => console.log("Here is the people from get people func:", people, " properties:",peopleArray), 1000);
					
				}
				//setPeopleProperties(peopleArray);
				//setImgIndx(indexArray);
				console.log("This is the index:",imgIndx)
				return peopleData
			} catch {
				return ({"msg":"error"})
			}

		}
		buildIdList();
		
	},[]) */

	const updatePeopleFavs = () => {
			const peopleArray = people.map(single => {
				const findFav = store.favList.find((value)=> value==single.uid) // is favorite?
				const fav = findFav? true : false
				return {'uid':single.uid, 'name':single.name, 'gender':'','fav':fav}
			})
			console.log('updated people fav array:',peopleArray)
			setPeople(peopleArray);

	}

	const planetCards = (planets) => {
		
		const render = planets.map((idx,keyIndex) => (
			<div className="card ms-2 bg-secondary" style={{flex: "0 0 300px" }} key={keyIndex}>
				<div className="m-2">
					<img src={(idx.uid=='1')? 'https://static.wikia.nocookie.net/esstarwars/images/b/b0/Tatooine_TPM.png/revision/latest?cb=20131214162357': `https://starwars-visualguide.com/assets/img/planets/${idx.uid}.jpg`} className="card-img-top" alt="..."/>
				</div>
				<div className="card-body">
					<h5 className="card-title">{idx.name}</h5>
					<p className="card-text">Population:</p>
					<a href="#" className="btn btn-primary">Learn more</a>
				</div>
			</div>))
		
		return render

	}

	const favorites = (id,fav,name) => {
		if (fav) {
			store.favsCount-- ;
			const idRm = store.favList.findIndex((value)=> value==id);
			const nameRm = store.favNames.findIndex((value)=> value==name);
			store.favList.splice(idRm, 1);
			store.favNames.splice(nameRm, 1);
		} else {
			store.favsCount++ ;
			store.favList.push(id);
			store.favNames.push(name)
		}
		updatePeopleFavs();
		console.log('fav names:', store.favNames)
	}
	
	const charactersCards = (people) => {
		//console.log("this the number of people:",store.totalPeople)
		const render = people.map((idx,keyIndex) => (
			<div className="card ms-2 bg-dark" style={{flex: "0 0 300px" }} key={keyIndex} >
				<div className="m-2">
					<img src={`https://starwars-visualguide.com/assets/img/characters/${idx.uid}.jpg`} className="card-img-top" alt="..."/>
				</div>
				<div className="card-body">
					<h5 className="card-title text-light">{idx.name}</h5>
					<p className="card-text text-light">Genre:</p>
					<div className='d-flex justify-content-between'>
						<button onClick={() => {navigate(`/single/${idx.uid}`)}} className="btn btn-primary">Learn more</button>
						<button type="button" className={idx.fav? 'btn btn-danger':'btn btn-secondary'}
							onClick={() => {favorites(idx.uid,idx.fav,idx.name)}}><i class="fa-regular fa-heart"></i></button>
							
					</div>
				</div>
			</div>))
		
		return render

	}
	
	return (
		<>
			<Navbar />
			<div className="text-start">
				
				<h3>Characters</h3>
					<div className="d-flex" style={{overflowX: 'auto', width:'98%'}}>
						{prevPplPage?<div>
										<button type="button" className="btn btn-primary" 
										onClick={()=> getPeopleHeader(prevPplPage)}>{'<<'}</button>
									</div> :null}
						{charactersCards(people)}
						{nextPplPage?<div>
										<button type="button" className="btn btn-primary" 
										onClick={()=> getPeopleHeader(nextPplPage)}>{'>>'}</button>
									</div> :null}
					</div>
				<h3>Planets</h3>
					<div className="d-flex" style={{overflowX: 'auto', width:'98%'}}>
						{prevPltPage?<div>
										<button type="button" className="btn btn-primary" 
										onClick={()=> getPlanetHeader(prevPltPage)}>{'<<'}</button>
									</div> :null}
						{planetCards(planetProperties)}
						{nextPltPage?<div>
										<button type="button" className="btn btn-primary" 
										onClick={()=> getPlanetHeader(nextPltPage)}>{'>>'}</button>
									</div> :null}
					</div>
			</div>
		</>
)};
