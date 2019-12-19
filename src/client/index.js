import { handleSubmit } from './js/formHandler'
//alert("I exist!")

import './styles/style.scss'

import Beachpalm from './media/Beachpalm.png';

let cityImage = document.getElementById('cityImg');
cityImage.src = Beachpalm;

// console.log("Beachpalm url is: " + Beachpalm)

export {
    handleSubmit
}