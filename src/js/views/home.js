import React, { useState, useEffect, useContext, useRef } from "react";
import { Navigate,useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Navbar } from "../component/navbar";
import rigoImage from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

export const Home = () => {
	//const [ imgIndx, setImgIndx ] = useState([])
	const [ people, setPeople ] = useState([]);
	const [ peopleDetails, setPeopleDetails] = useState([]);
	const [ planet, setPlanet ] = useState([]);
	const [ planetDetails, setPlanetDetails ] = useState([]);
	const [ nextPplPage, setNextPplPage ] = useState(null);
	const [ prevPplPage, setPrevPplPage ] = useState(null);
	const [ nextPltPage, setNextPltPage ] = useState(null);
	const [ prevPltPage, setPrevPltPage ] = useState(null);
	const [ blurPeople, setBlurPeople ] = useState(false);
	const [ blurPlanet, setBlurPlanet ] = useState(false);
	const [ loading, setLoading ] = useState({person:true,planet:true});
	const { store, actions } = useContext(Context);
	const navigate = useNavigate()
	const divRef = useRef(null);
	const divpRef = useRef(null);


	const getPeopleHeader = async (url) => {

		fetch(url,{
				cache: "no-store",
				headers:{'content-type':'application/json'}
			})
			.then( response => {
				if (!response.ok) {
					throw new Error(response.statusText);
					}
					return response.json();	
				} )
			.then (resp => {
				setNextPplPage(resp.next)
				setPrevPplPage(resp.previous)
				const peopleArray = resp.results.map(single => {
					const findFav = store.favList.find((value)=> value.id=='c'+single.uid) // is favorite?
					const fav = findFav? true : false
					return {'uid':single.uid, 'name':single.name, 'gender':'*','hairColor':'*','eyeColor':'*','fav':fav}
				})
				getPeopleDetails(peopleArray)
				
			})
			.catch( console.log('An error occurred'))
			return

		} 
	

	const getPlanetHeader = async (url) => {
		
		fetch(url,{
			cache: "no-store",
			headers:{'content-type':'application/json'}
		})
		.then( response => {
			if (!response.ok) {
				throw new Error(response.statusText);
				}
				return response.json();	
			} )
		.then (resp => {
			setNextPltPage(resp.next)
			setPrevPltPage(resp.previous)
			const planetArray = resp.results.map(single => {
				const findFav = store.favList.find((value)=> value.id=='p'+single.uid) // is favorite?
				const fav = findFav? true : false
				return {'uid':single.uid, 'name':single.name, 'population':'*','terrain':'*','diameter':'*','gravity':'','fav':fav}
			})
			getPlanetDetails(planetArray)
			
		})
		.catch( console.log('An error occurred'))
		return


	}

	const getPlanetDetails = async(planet) => {
			const world = []
			const planetArray = planet.map((planetItem, indx)=>{
				const url= `https://www.swapi.tech/api/planets/${planetItem.uid}`
				fetch(url,{ cache: "no-store",
					headers:{'content-type':'application/json'}})
				.then (response => {
					if (!response.ok) {
						throw new Error(response.statusText);
						}
						return response.json();	
					})
				.then ( resp => {
					const details=resp;
					planetItem.terrain=details.result.properties.terrain
					planetItem.population=details.result.properties.population
					planetItem.gravity=details.result.properties.gravity
					world.push(planetItem)
					setTimeout( ()=> {
										setPlanet(world);
										setLoading(prevLoading => ({...prevLoading, planet: false}));
										setBlurPlanet(false)
									},2500)
					return
					})
				.catch (error => {console.log('There was an error with the planet details:'),error})
				return

				})	
			return }

			const getPeopleDetails = async(people) => {
				const person = []
				const peopleArray = people.map((peopleItem, indx)=>{
					const url= `https://www.swapi.tech/api/people/${peopleItem.uid}`
					fetch(url,{ cache: "no-store",
						headers:{'content-type':'application/json'}})
					.then (response => {
						if (!response.ok) {
							throw new Error(response.statusText);
							}
							return response.json();	
						})
					.then ( resp => {
						const details=resp;
						peopleItem.gender=details.result.properties.gender
						peopleItem.hairColor=details.result.properties.hair_color
						peopleItem.eyeColor=details.result.properties.eye_color
						person.push(peopleItem)
						setTimeout( ()=> {
											setPeople(person);
											setLoading(prevLoading => ({...prevLoading, person: false}));
											setBlurPeople(false)
										},2500)
						return
						})
					.catch (error => {console.log('There was an error with the details:'),error})
					return
	
					})	
				return }
			


	useEffect(()=>{
		getPeopleHeader('https://www.swapi.tech/api/people');
		getPlanetHeader('https://www.swapi.tech/api/planets');
		},[])

	const updatePeopleFavs = () => {
			const peopleArray = people.map(single => {
				const findFav = store.favList.find((value)=> value.id=='c'+single.uid) // is favorite?
				const fav = findFav? true : false
				single.fav=fav;
				return single
			})
			setPeople(peopleArray);

	}

	const updatePlanetFavs = () => {
		const planetArray = planet.map(single => {
			const findFav = store.favList.find((value)=> value.id=='p'+single.uid) // is favorite?
			const fav = findFav? true : false
			single.fav=fav;
			return single
		})
		setPlanet(planetArray);

	}

	const nav =(name) => {
		store.favsCount--
		const nameRm = store.favNames.findIndex((value)=> value==name.name);
		store.favNames.splice(nameRm, 1);
		const idRm = store.favList.findIndex((value)=> value.name==name.name);
		console.log('this is the id position identified:',idRm)
		store.favList.splice(idRm, 1);
		console.log('store fav names:',store.favNames,'fav ids:',store.favList);
		updatePeopleFavs();
		updatePlanetFavs()
	}

	

	const favorites = (id,fav,name) => {
		//id = element+id;
		if (fav) {
			store.favsCount-- ;
			const idRm = store.favList.findIndex((value)=> value.id==id);
			const nameRm = store.favNames.findIndex((value)=> value==name);
			store.favList.splice(idRm, 1);
			store.favNames.splice(nameRm, 1);
		} else {
			store.favsCount++ ;
			store.favList.push({'id':id,'name':name});
			store.favNames.push(name)
		}
		updatePeopleFavs();
		updatePlanetFavs();
		console.log('fav names:', store.favList)
	}
	
	const charactersCards = (swpeople) => {
		const render = swpeople.map((idx,keyIndex) => (
			<div className="card ms-2 bg-dark" style={{flex: "0 0 300px", filter: blurPeople? 'blur(5px)':'none' }} key={keyIndex} >
				<div className="m-2">
					<img src={`https://starwars-visualguide.com/assets/img/characters/${idx.uid}.jpg`} className="card-img-top" alt="..."/>
				</div>
				<div className="card-body" style={{'line-height': 1.0}} >
					<h5 className="card-title text-light">{idx.name}</h5>
					<p className="card-text text-light"></p>
					<p className="card-text text-light">Genre:{idx.gender}</p>
					<p className="card-text text-light">Hair Color:{idx.hairColor}</p>
					<p className="card-text text-light">Eye Color:{idx.eyeColor}</p>
					
					<div className='d-flex justify-content-between'>
						<button onClick={() => {navigate(`/single/${idx.uid}`)}} className="btn btn-primary">Learn more</button>
						<button type="button" className={idx.fav? 'btn btn-danger':'btn btn-secondary'}
							onClick={() => {favorites('c'+idx.uid,idx.fav,idx.name)}}><i class="fa-regular fa-heart"></i></button>
							
					</div>
				</div>
			</div>))
		
		return render

	}
	
	const planetCards = (planets) => {
		
		const render = planets.map((idx,keyIndex) => (
			<div className="card ms-2 bg-secondary" style={{flex: "0 0 300px" }} key={keyIndex}>
				<div className="m-2">
					<img src={(idx.uid=='1')? 'https://static.wikia.nocookie.net/esstarwars/images/b/b0/Tatooine_TPM.png/revision/latest?cb=20131214162357': `https://starwars-visualguide.com/assets/img/planets/${idx.uid}.jpg`} className="card-img-top" alt="..."/>
				</div>
				<div className="card-body" style={{'line-height': 1.0}}>
					<h5 className="card-title">{idx.name}</h5>
					<p className="card-text"></p>
					<p className="card-text">Population:{idx.population}</p>
					<p className="card-text">Terrain:{idx.terrain}</p>
					<div className='d-flex justify-content-between'>
						<button onClick={() => {navigate(`/planet/${idx.uid}`)}} className="btn btn-primary">Learn more</button>
						<button type="button" className={idx.fav? 'btn btn-danger':'btn btn-secondary'}
							onClick={() => {favorites('p'+idx.uid,idx.fav,idx.name)}}>
								<i class="fa-regular fa-heart"></i>
						</button>
					</div>
				</div>
			</div>))
		return render
	}

	const move = (nextpage) =>{
		setLoading(prevLoading => ({...prevLoading, person: true}));
		console.log('moving',divRef.current);
		setBlurPeople(true)
		getPeopleHeader(nextpage)
		if (divRef.current) {
             divRef.current.scrollTo({ left: 0, behavior: "smooth" })	
        }

	} 

	const movePlanet = (nextpage) =>{
		setLoading(prevLoading => ({...prevLoading, planet: true}));
		console.log('moving',divRef.current);
		setBlurPlanet(true);
		getPlanetHeader(nextpage);
		if (divpRef.current) {
             divpRef.current.scrollTo({ left: 0, behavior: "smooth" })	
        }

	}


	return (
		<>
			<Navbar onUpdate={nav}/>
			<div className="text-start">
				<div className="d-flex">
					<h3 className="ms-5 me-5" style={{color:'red'}}>Characters</h3>
					{loading.person? <div class="spinner-border" role="status">
									<span class="visually-hidden">Loading...</span>
								</div> : null}
				</div>
					<div className="d-flex" style={{overflowX: 'auto', width:'98%',
											filter: blurPeople? 'grayscale(100%)':'none'}} ref={divRef}>
						{prevPplPage?<div>
										<button type="button" className="btn btn-primary" 
										onClick={()=> move(prevPplPage)}>{'<<'}</button>
									</div> :null}
						{charactersCards(people)}
						{nextPplPage?<div>
										<button type="button" className="btn btn-primary" 
										onClick={()=> move(nextPplPage)}>{'>>'}</button>
									</div> :null}
					</div>
				<div className="d-flex">
					<h3 className="ms-5 me-5" style={{color:'red'}}>Planets</h3>
						{loading.planet? <div class="spinner-border" role="status">
											<span class="visually-hidden">Loading...</span>
										</div> : null}
				</div>
					<div className="d-flex" style={{overflowX: 'auto', width:'98%' ,
													filter: blurPlanet? 'grayscale(100%)':'none'}} ref={divpRef}>
						{prevPltPage?<div>
										<button type="button" className="btn btn-primary" 
										onClick={()=> movePlanet(prevPltPage)}>{'<<'}</button>
									</div> :null}
						{planetCards(planet)}
						{nextPltPage?<div>
										<button type="button" className="btn btn-primary" 
										onClick={()=> movePlanet(nextPltPage)}>{'>>'}</button>
									</div> :null}
					</div>
			</div>
		</>
)};
