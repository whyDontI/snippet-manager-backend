const snippetModel = require("../model/snippets");

const getSnippets = async (req, res) => {
  try {
    const snippets = await snippetModel.getSnippets();

    if (!snippets.length) {
      return res.boom.notFound("Snippets not found");
    }

    return res.json({
      message: "Returned snippets successfully",
      data: snippets,
    });
  } catch (err) {
    logger.error("Error while fetching snippets", { err });
    return res.boom.badImplementation("An internal server error occurred");
  }
};

const getSnippet = async (req, res) => {
  try {
    const { id } = req.params;
    const snippet = await snippetModel.getSnippet(id);

    if (!snippet) {
      return res.boom.notFound("Snippet not found");
    }

    return res.json({
      message: "Returned snippets successfully",
      data: snippet,
    });
  } catch (err) {
    logger.error("Error while fetching snippet", { err });
    return res.boom.badImplementation("An internal server error occurred");
  }
};

const createSnippet = async (req, res) => {
  try {
    const snippetId = await snippetModel.createSnippet(req.body);
    if (snippetId) {
      return res.json({
        message:
          "Added snippet successfully, sent the email with login details",
        snippetId,
      });
    }

    return res.boom.badData("Error");
  } catch (error) {
    logger.error(`Error while adding snippet: ${error}`);
    return res.boom.serverUnavailable(
      "Something went wrong please contact admin",
    );
  }
};

const updateSnippet = async (req, res) => {
  try {
    const { id } = req.params;

    const snippet = await snippetModel.getSnippet(id);
    if (!snippet) {
      return res.boom.conflict("Snippet with given credentials doesn't exist");
    }

    const snippetId = await snippetModel.updateSnippet(id, req.body);

    return res.json({
      message: "Updated snippet successfully",
      snippetId,
    });
  } catch (error) {
    logger.error(`Error while updating snippet: ${error}`);
    return res.boom.serverUnavailable(
      "Something went wrong please contact admin",
    );
  }
};

const deleteSnippet = async (req, res) => {
  try {
    const { id } = req.params;

    const snippetId = await snippetModel.deleteSnippet(id);

    return res.json({
      message: "Deleted snippet successfully",
      snippetId,
    });
  } catch (error) {
    logger.error(`Error while updating snippet: ${error}`);
    return res.boom.serverUnavailable(
      "Something went wrong please contact admin",
    );
  }
};

module.exports = {
  getSnippets,
  getSnippet,
  createSnippet,
  updateSnippet,
  deleteSnippet,
};
