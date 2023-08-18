const Firestore = require("@google-cloud/firestore");
const firestore = require("../utils/firestore");
const ref = firestore.collection("snippets");

const getSnippets = async () => {
  try {
    const snapshot = await ref.get();
    const snippets = [];

    if (snapshot.empty) {
      return [];
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const doc of snapshot.docs) {
      // eslint-disable-next-line no-await-in-loop
      snippets.push({
        id: doc.id,
        ...doc.data(),
      });
    }

    return snippets;
  } catch (err) {
    logger.error("Error fetching snippets", err);
    throw err;
  }
};

const getSnippet = async (id) => {
  try {
    const snapshot = await ref.doc(id).get();
    if (!snapshot.exists) {
      return null;
    }

    const snippet = {
      id: snapshot.id,
      ...snapshot.data(),
    };

    return snippet;
  } catch (err) {
    logger.error("Error fetching snippet data", err);
    throw err;
  }
};

const createSnippet = async (snippet) => {
  try {
    const res = await ref.add(snippet);
    return res.id;
  } catch (err) {
    logger.error("Error adding snippet", err);
    throw err;
  }
};

const updateSnippet = async (id, data) => {
  try {
    const updateObject = {
      ...data,
      lastUpdated: Firestore.Timestamp.now(),
    };

    const res = await ref.doc(id).update(updateObject);
    return res.id;
  } catch (err) {
    logger.error("Error updating snippet", err);
    throw err;
  }
};

const deleteSnippet = async (id) => {
  try {
    const res = await ref.doc(id).delete();
    return res.id;
  } catch (err) {
    logger.error("Error updating snippet", err);
    throw err;
  }
};

module.exports = {
  getSnippets,
  getSnippet,
  createSnippet,
  updateSnippet,
  deleteSnippet,
};
