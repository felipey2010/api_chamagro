import express from "express"
import {
  createChamadoController,
  findAllChamadosController,
  findChamadoByIdController,
  deleteeChamadoController,
  updateChamadoController,
  findChamadoByUserIdController,
} from "../../controllers/chamados.controller"

// import { validate } from "../../middlewares/validate";
const router = express.Router()

router.route("/").post(createChamadoController).get(findAllChamadosController)

router
  .route("/:id")
  .get(findChamadoByIdController)
  .delete(deleteeChamadoController)
  .put(updateChamadoController)

router.route("/user/:userId").get(findChamadoByUserIdController)

export = router
