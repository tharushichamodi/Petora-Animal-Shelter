// server.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');


const reviewApi = require('./reviews/review_Api');  // import review routes
const userApi = require('./users/user_Api');  // import review routes
const employeeApi = require('./employees/employee_Api');

//vet
const vetMedApi = require('./vetMedications/vetMedication_Api');  // import review routes
const vetAnimalProfileApi = require('./vetAnimalMedical_profiles/vetAnimalMedical_Api');
const vetReminderApi = require('./vetReminders/vetReminder_Api');
const vetShedulerApi = require('./vetShedulers/vetSheduler_Api');

// animal management
const rescueTeamsApi = require('./rescue_teams/rescue_team_Api');
const rescueOpsApi = require('./rescueOperations/rescueOperations_Api');
const animalProfileApi = require('./animalProfiles/animal_profile_Api');
const adoptionApplicationApi = require('./adoptionApplications/adoption_application_Api');
const rescuerApi = require('./rescue_members/rescue_member_Api')
const petProfileApi = require('./pet_profiles/pet_profile_Api');

//training modules
const trainerApi = require('./trainers/trainer_Api');
const trainingPackageApi = require('./training_packages/training_packges_Api');
const trainingBookingApi = require('./training_bookings/training_bookings_Api');

//grooming
const groomingReservationApi = require('./grooming_reservation/grooming_reservation_Api'); // import grooming reservation routes
const groomingPackagesApi = require('./grooming_packages/grooming_packages_Api'); // import grooming packages routes

// daycare
const daycareBookingApi = require('./daycare_bookings/daycare_booking_Api');
const daycareStaffSchedulingApi = require('./daycare_staff_scheduling/daycare_staff_scheduling_Api');
const daycareActivityLogApi = require('./daycare_activitylogs/daycare_activitylog_Api');
const daycareIncidentApi = require('./daycare_incident/daycare_incident_Api');


const app = express();
const PORT = 3001;
const MONGO_URI = 'mongodb+srv://koshithaS:koshi2002@mycluster.mbslrag.mongodb.net/petoraDB?retryWrites=true&w=majority&appName=myCluster';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// ✅ Serve uploaded files
app.use('/uploads', express.static('uploads'));
// ✅ Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Mount APIs
app.use('/review/api/reviews', reviewApi);
app.use('/user/api/users', userApi);
app.use('/employee/api/employees', employeeApi);

//vet
app.use('/vetMedication/api/vetMedications', vetMedApi);
app.use('/vetAnimalMedical_profile/api/vetAnimalMedical_profiles', vetAnimalProfileApi);
app.use('/vetReminder/api/vetReminders', vetReminderApi);
app.use('/vetSheduler/api/vetShedulers', vetShedulerApi);

// animal management
app.use('/rescueTeam/api/rescueTeams', rescueTeamsApi);
app.use('/rescueOp/api/rescueOps', rescueOpsApi);
app.use('/animalProfile/api/animalProfiles', animalProfileApi);
app.use('/adoptionApplication/api/adoptionApplications', adoptionApplicationApi);
app.use('/rescuer/api/rescuers', rescuerApi)
app.use('/petProfile/api/petProfiles', petProfileApi);

//training modules
app.use('/trainer/api/trainers', trainerApi);
app.use('/trainingPackage/api/trainingPackages', trainingPackageApi);
app.use('/trainingBooking/api/trainingBookings', trainingBookingApi);

// grooming 
app.use('/groomingReservation/api/groomingReservations', groomingReservationApi);
app.use('/groomingPackage/api/groomingPackages', groomingPackagesApi);


// daycare
app.use('/daycare_booking/api/daycare_bookings', daycareBookingApi);
app.use('/daycare_staff_scheduling/api/staff_shifts', daycareStaffSchedulingApi);
app.use('/daycare_activitylog/api/activity_logs', daycareActivityLogApi);
app.use('/daycare_incident/api/incidents', daycareIncidentApi);
  
app.use('/groomingReservation/api/groomingReservations', groomingReservationApi);
app.use('/groomingPackage/api/groomingPackages', groomingPackagesApi);

// Connect to MongoDB and start server
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });


