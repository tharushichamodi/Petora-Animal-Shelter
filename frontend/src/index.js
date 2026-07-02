import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import PaymentPortal from './payment_portal';
import Header from './header';
import Test from './test';
import Chatbot from './chatbot';
import Cart from './cart';
import AboutusAndContactUs from './aboutus_and_contactus';
import Signup from './signup';
import Home from './home';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import TosAndPrivacyPolicy from './tos_privacy_policy';
import reportWebVitals from './reportWebVitals';
import Store from './store';
import Review from './submitReview';
import Admin from './admin_dashboard'; // Import the Admin component
import RescuedAnimals from './rescued_Animals'; // Import the Rescued Animals component
import FAQ from './faq';
import AnimalProfile from './animal_profile';
import DisplayReviews from './display_reviews'
import AnimalManagerDashboard from'./animal_manager_dashboard'
import FillAdoptionApplication from './fill_adoption_application.js';
import GroomingCoordinatorDashBoard from './grooming_coordinator_dashboard';
import DaycareManagerDashboard from './daycare_manager_dashboard.js';
import GroomingReservation from './grooming_reservation.js';
import Vetdashboard from './veterinary_dashboard.js'
import VetReminders from './VetReminders.js';
import VetTreatmentScheduler from './vet_treatment_scheduler.js';
import VetMedications from './Vet_Medications.js';
import AnimalMedicleProfile from './animal_medical_profile.js'
import TrainingCoordinatorDashboard from './training_coordinator_dashboard.js'
import AdoptionOfficerDashboard from './adoption_officer_dashboard.js'
import CustomerDashboard from './customer_dashboard.js'
import HealthManagerDashboard from './health_manager_dashboard.js'
import ScrollToTop from './scrollToTop.js';
import GroomerDashboard from './groomer_dashboard.js';
import GroomingServices from './cd_grooming_services';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ScrollToTop />
    <Routes>
      <Route path='/' element = {<Home />} />      
      <Route path='/payment_portal' element = {<PaymentPortal />} />
      <Route path='/header' element = {<Header/>} />
      <Route path='/test' element = {<Test/>} />
      <Route path='/chatbot' element = {<Chatbot/>} />
      <Route path='/cart' element = {<Cart/>} />
      <Route path='/aboutus_and_contactus' element = {<AboutusAndContactUs/>} />
      <Route path='/tos_privacy_policy' element = {<TosAndPrivacyPolicy/>} />
      <Route path='/store' element = {<Store/>} />
      <Route path='/home' element = {<Home/>} />
      <Route path='/signup' element = {<Signup/>} />
      <Route path='/submitReview' element = {<Review/>} />
      <Route path='/admin_dashboard' element = {<Admin/>} /> 
      <Route path='/rescued_animals' element = {<RescuedAnimals/>} />
      <Route path='/faq' element = {<FAQ/>} /> 
      <Route path='/animal_profile' element = {<AnimalProfile/>} />
      <Route path='/display_reviews' element = {<DisplayReviews/>} />
      <Route path='/animal_manager_dashboard' element = {<AnimalManagerDashboard/>} />
      <Route path='/fill_adoption_application' element = {<FillAdoptionApplication/>} />
      <Route path='/grooming_coordinator_dashboard' element = {<GroomingCoordinatorDashBoard/>} />
      <Route path='/daycare_manager_dashboard' element = {<DaycareManagerDashboard/>} />
      <Route path='/grooming_reservation' element = {<GroomingReservation/>} />
      <Route path='/veterinary_dashboard' element = {<Vetdashboard/>} />
      <Route path='/VetReminders' element = {<VetReminders/>} />
      <Route path='/vet_treatment_scheduler' element = {<VetTreatmentScheduler/>} />
      <Route path='/Vet_Medications' element = {<VetMedications/>} />
      <Route path='/animal_medical_profile' element = {<AnimalMedicleProfile/>} />
      <Route path='/training_coordinator_dashboard' element = {<TrainingCoordinatorDashboard/>} />
      <Route path='/adoption_officer_dashboard' element = {<AdoptionOfficerDashboard/>} />
      <Route path='/customer_dashboard' element = {<CustomerDashboard/>} />
      <Route path='/health_manager_dashboard' element = {<HealthManagerDashboard/>} />
      <Route path='/groomer_dashboard' element = {<GroomerDashboard/>} />
      <Route path='/grooming_services' element = {<GroomingServices/>} />
      

    </Routes>

  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
