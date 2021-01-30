const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Joi = require("joi");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = 8080;
const appName = "My Validator App";

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

app.use(cors());

function handleValidation(dataToValidate) {
  const { rule, data } = dataToValidate;

  const { field, condition, condition_value } = rule;
  console.log("field", field);
  const fieldValue = field.split(".");
  console.log("fieldValue", fieldValue);

  let dataObject = data;
  console.log("dataObject", dataObject);
  console.log("rule", rule);
  let result = {
    validation: {
      error: true,
      ...rule,
    },
  };
  let message = "";
  let error = false;

  for (const eachValue of fieldValue) {
    if (!dataObject.hasOwnProperty(eachValue)) {
      error = true;
      message = `field ${field} is missing from data.`;
      result = null;
      break;
    }
    dataObject = dataObject[eachValue];
  }

  if (!error) {
    result.validation.field_value = dataObject;
    if (condition === "gte") {
      if (dataObject >= condition_value) {
        error = false;
        message = `field ${field} successfully validated.`;
      } else {
        error = true;
        message = `field ${field} failed validation.`;
      }
    } else if (condition === "gt") {
      if (dataObject > condition_value) {
        error = false;
        message = `field ${field} successfully validated.`;
      } else {
        error = true;
        message = `field ${field} failed validation.`;
      }
    } else if (condition === "neq") {
      if (dataObject !== condition_value) {
        error = false;
        message = `field ${field} successfully validated.`;
      } else {
        error = true;
        message = `field ${field} failed validation.`;
      }
    } else if (condition === "eq") {
      if (dataObject === condition_value) {
        error = false;
        message = `field ${field} successfully validated.`;
      } else {
        error = true;
        message = `field ${field} failed validation.`;
      }
    } else if (condition === "contains") {
      if (dataObject.match(/condition_value/gim)) {
        error = false;
        message = `field ${field} successfully validated.`;
      } else {
        error = true;
        message = `field ${field} failed validation.`;
      }
    } else {
      if (dataObject.match(/condition_value/gim)) {
        error = false;
        message = `field ${field} successfully validated.`;
      } else {
        error = true;
        message = `field ${field} failed validation.`;
      }
    }
    result.validation.error = error;
  }

  return {
    message,
    status: error ? "error" : "success",
    data: result,
  };
}

app.post("/validate-rule", async (req, res) => {
  console.log("req.body", req.body);

  const bodySchema = Joi.object({
    rule: Joi.object({
      field: Joi.string().required().messages({
        "string.base": `field should be a String.`,
        "any.required": `field is required.`,
      }),
      condition: Joi.string().required().messages({
        "string.base": `condition should be a String.`,
        "any.required": `condition is required.`,
      }),
      condition_value: Joi.any().required().messages({
        "any.required": `condition value is required.`,
      }),
    })
      .required()
      .messages({
        "object.base": `rule should be an object.`,
        "any.required": `rule is required.`,
      }),

    data: Joi.any().required().messages({
      "any.required": `data is required.`,
    }),
  });

  try {
    await bodySchema.validateAsync(req.body);

    const value = await handleValidation(req.body);
    return res.status(value.status === "error" ? 400 : 200).send({
      ...value,
    });
  } catch (error) {
    res.status(400).send({
      message: `${error.details[0].message.replace(/['"]+/g, "")}.`,
      status: "error",
      data: null,
    });
  }
});

app.listen(PORT, (res) => {
  console.log(`${appName} is listening on ${PORT}`);
});
