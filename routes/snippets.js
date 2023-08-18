const { Router } = require("express");
const {
  getSnippets,
  getSnippet,
  createSnippet,
  deleteSnippet,
  updateSnippet,
} = require("../controllers/snippets.js");

const validator = require("../middlewares/validators/snippets.js");
const router = Router();

router.get("/", getSnippets);
router.get("/:id", getSnippet);
router.post("/", validator.create, createSnippet);
router.delete("/:id", deleteSnippet);
router.patch("/:id", validator.update, updateSnippet);

module.exports = router;
