import React, { useState } from "react";
import {
  Button,
  Dropdown,
  Form,
  Header,
  Message,
  Segment,
} from "semantic-ui-react";
import * as yup from "yup";

import SemanticDatepicker from "react-semantic-ui-datepickers";
import "react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css";

import { Formik, FormikHelpers } from "formik";
import { SemanticDatepickerProps } from "react-semantic-ui-datepickers/dist/types";

import { origin } from '../../common/get.origin';

interface ILocation {
  lat: string; // TODO: very bad shortcut come back to number

  lng: string; // TODO: very bad shortcut come back to number
}
type FeedbackStatus = "none" | "success" | "error";

interface FormValues {
  patientName: string;
  patientAge: string; // TODO: very bad shortcut come back to number
  testDate: number;
  outcome: string;
  location: ILocation;
  country: string;
}

const validationSchema = yup.object({
  patientName: yup.string().required("Patient name is required"),
  patientAge: yup.number().required("Patient age is required"),
  testDate: yup.string().required("Test date is required"),
  outcome: yup.string().required("Outcome is required"),
  location: yup
    .object({
      lat: yup.number().required("Latitude is required"),
      lng: yup.number().required("Longitude is required"),
    })
    .required("Location is required"),
  country: yup.string().required("Country is required"),
});

const countryOptions = [
  { key: "pl", value: "poland", flag: "pl", text: "Poland" },
  { key: "us", value: "usa", flag: "us", text: "United States" },
];

const TestForm = () => {
  const [feedbackStatus, setFeedbackStatus] = useState<FeedbackStatus>("none");

  const onSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    const formData = JSON.stringify(values);

    const response = await fetch(`${origin}/test`, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json",
      },
    });

    await new Promise((resolve) => {
      setTimeout(() => resolve(""), 100);
    });

    if (response.status !== 201) {
      setFeedbackStatus("error");
    } else {
      setFeedbackStatus("success");
      actions.resetForm();
    }
  };

  return (
    <>
      <Header as="h2" attached="top">
        Here you can add a new test
      </Header>
      <Segment attached>
        <Formik
          initialValues={{
            patientName: "",
            patientAge: "",
            testDate: (new Date()).getTime(),
            outcome: "",
            location: {
              lat: "",
              lng: "",
            },
            country: ""
          }}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
          }) => (
            <Form
                novalidate=""
              onSubmit={handleSubmit}
              loading={isSubmitting}
              success={feedbackStatus === "success"}
              error={feedbackStatus === "error"}
            >
              <Form.Field required>
                <Form.Input
                  required
                  label="Patient Name"
                  id="patientName"
                  placeholder="Patient Name"
                  name="patientName"
                  type="input"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.patientName}
                  error={
                    errors.patientName &&
                    touched.patientName && {
                      id: "patient-name-error",
                      content: errors.patientName,
                      pointing: "below",
                    }
                  }
                />
              </Form.Field>
              <Form.Field requried>
                <Form.Input
                  required
                  label="Patient Age"
                  id="patientAge"
                  placeholder="Patient Age"
                  name="patientAge"
                  type="input"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.patientAge}
                  error={
                    errors.patientAge &&
                    touched.patientAge && {
                      id: "patient-age-error",
                      content: errors.patientAge,
                      pointing: "below",
                    }
                  }
                />
              </Form.Field>
              <Form.Field required>
                <label>Test Date</label>
                <SemanticDatepicker
                  datePickerOnly={true}
                  clearable={false}
                  clearOnSameDateClick={false}
                  onChange={(event, data: SemanticDatepickerProps) => {
                    const date = data.value as Date;
                    setFieldValue("testDate", date.getTime());
                  }}
                  value={new Date(values.testDate)}
                />
              </Form.Field>
              <Form.Group grouped>
                <Form.Field
                  label="Outcome"
                  required
                  error={
                    errors.outcome &&
                    touched.outcome && {
                      id: "outcome-error",
                      content: errors.outcome,
                      pointing: "below",
                    }
                  }
                ></Form.Field>
                <Form.Radio
                  id="outcome-negative"
                  name="outcome"
                  type="radio"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.outcome && touched.outcome}
                  label="Negative"
                  value="negative"
                  checked={values.outcome === "negative"}
                />
                <Form.Radio
                  id="outcome-positive"
                  name="outcome"
                  type="radio"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.outcome && touched.outcome}
                  label="Positive"
                  value="positive"
                  checked={values.outcome === "positive"}
                />
              </Form.Group>
              <Form.Group grouped>
                <Form.Field>
                  <Form.Input
                    label="Latitude"
                    id="lat"
                    required
                    placeholder="Latitude"
                    name="location.lat"
                    type="input"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.location?.lat}
                    error={
                      errors.location?.lat &&
                      touched.location?.lat && {
                        id: "lat-error",
                        content: errors.location?.lat,
                        pointing: "below",
                      }
                    }
                  />
                </Form.Field>
                <Form.Field>
                  <Form.Input
                    label="Longitude"
                    id="lng"
                    required
                    placeholder="Longitude"
                    name="location.lng"
                    type="input"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.location?.lng}
                    error={
                      errors.location?.lng &&
                      touched.location?.lng && {
                        id: "lng-error",
                        content: errors.location?.lng,
                        pointing: "below",
                      }
                    }
                  />
                </Form.Field>
              </Form.Group>
              <Form.Field>
                <Dropdown
                  placeholder="Select Country"
                  fluid
                  selection
                  options={countryOptions}
                  value={values.country}
                  onChange={(event, data) => {
                    setFieldValue("country", data.value);
                  }}
                  error={!!errors.country && !!touched.country}
                />
              </Form.Field>
              <Button type="submit">Submit</Button>

              <Message
                id="feedback-msg-success"
                success
                header="Success"
                content="The test has been stored."
              />
              <Message
                id="feedbackmsg-error"
                error
                header="Error"
                content="An error occured."
              />
            </Form>
          )}
        </Formik>
      </Segment>
    </>
  );
};

export default TestForm;
