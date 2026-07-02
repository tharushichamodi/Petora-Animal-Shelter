const express = require("express");
const router = express.Router();

const incidentController = require("./daycare_incident_controller");

// GET all incidents
router.get("/", incidentController.getAllIncidents);

// GET one incident
router.get("/:id", incidentController.getIncident);

// POST create incident
router.post("/", incidentController.addIncident);

// PUT update incident
router.put("/:id", incidentController.updateIncident);

// DELETE an incident
router.delete("/:id", incidentController.deleteIncident);

module.exports = router;
