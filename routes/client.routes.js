const express = require("express");
const router = express.Router();
const clientController = require("../controller/client.controller");
const {canView} = require("../middleware/permission.middleware");

router.get("/", canView, (req, res) => {
	res.render("client", {title: "clients"});
});

// get count of clients
router.get("/total", (req, res) => {
	clientController.countClients(req, res);
})

router.get("/all", (req, res) => {
	clientController.getAllClients(req, res);
})

router.get("/login", (req, res) => {
	clientController.getClientId(req, res);
})

// pagination
router.get("/:from/:to", (req, res) => {
	clientController.paginate(req, res);
})

router.post("/", (req, res) => {
	clientController.create(req, res);
})

router.post("/:id", (req, res) => {
	clientController.updateAndCreateClientAsAUser(req, res);
})

router.put("/:id", (req, res) => {
	clientController.update(req, res);
})

router.delete("/:id", (req, res) => {
	clientController.deleteClient(req, res);
})

module.exports = router;