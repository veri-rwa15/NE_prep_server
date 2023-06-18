import { genSalt, hash } from "bcrypt";
import { createSuccessResponse, errorResponse, serverErrorResponse, successResponse } from "../utils/api.response.js";
import _ from "lodash";
import { Student } from "../models/student.model.js";

export const registerStudent  = async (req, res) => {
  try {

    // validating 

    let checkEmail = await Student.findOne({ email: req.body.email })
    if (checkEmail) return errorResponse("Email is already registered!",res)

    let checkPhone = await Student.findOne({ phone: req.body.phone })
    if (checkPhone) return errorResponse("Phone number is already registered!",res)

    let checkNationalId = await Student.findOne({ nationalId: req.body.nationalId })
    if (checkNationalId) return errorResponse("National ID is already registered!",res)

    // creating instance of a student

    let student = new Student(
      _.pick(req.body, [
        "firstname",
        "lastname",
        "nationalId",
        "email",
        "password",
        "phone",
      ])
    );

      // hashing password
    const salt = await genSalt(10);
    student.password = await hash(student.password, salt);

    // registering student

    try {
      await student.save();
      return createSuccessResponse("student registered successfully. You can tell him to login", {}, res);
    } catch (ex) {
      return errorResponse(ex.message, res);
    }
  } catch (ex) {
    return serverErrorResponse(ex,res)
  }
};