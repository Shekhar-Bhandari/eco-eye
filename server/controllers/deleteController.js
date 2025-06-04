import CapturedImage from "../models/captureModel.js";

export const deleteController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "No image found with this id",
      });
    }

//delete
    const deleted = await CapturedImage.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).send({
        success: false,
        message: "No image found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Your image has been deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in delete image API",
    });
  }
};
