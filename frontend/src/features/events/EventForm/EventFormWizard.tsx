import React, { useState } from "react";
import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Paper,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import EventFormStep1 from "./EventFormStep1";
import EventFormStep2 from "./EventFormStep2";
import EventFormStep3 from "./EventFormStep3";
import EventFormReview from "./EventFormReview";
import { useCreateEventMutation } from "../../../api/eventsApi";

const steps = [
  "Basic Details",
  "Zoom Settings",
  "Invite Speakers",
  "Review & Submit",
];

export interface EventFormValues {
  title: string;
  description: string;
  dateTime: string;
  zoomEnabled: boolean;
  zoomLink: string;
  speakers: string[];
}

const defaultValues: EventFormValues = {
  title: "",
  description: "",
  dateTime: "",
  zoomEnabled: false,
  zoomLink: "",
  speakers: [],
};

const EventFormWizard: React.FC<{ onSuccess?: () => void }> = ({
  onSuccess,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const methods = useForm<EventFormValues>({
    defaultValues,
    mode: "onTouched",
  });
  const [createEvent, { isLoading }] = useCreateEventMutation();

  const handleNext = async () => {
    const valid = await methods.trigger();
    if (valid) setActiveStep((prev) => prev + 1);
  };
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleSubmit = async (data: EventFormValues) => {
    try {
      await createEvent(data).unwrap();
      if (onSuccess) onSuccess();
    } catch (err) {
      // Optionally show error feedback
      alert("Failed to create event");
    }
  };

  return (
    <FormProvider {...methods}>
      <Paper sx={{ p: 4, borderRadius: 3, maxWidth: 600, mx: "auto" }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          {activeStep === 0 && <EventFormStep1 />}
          {activeStep === 1 && <EventFormStep2 />}
          {activeStep === 2 && <EventFormStep3 />}
          {activeStep === 3 && <EventFormReview />}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>
            {activeStep < steps.length - 1 ? (
              <Button onClick={handleNext} variant="contained">
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </FormProvider>
  );
};

export default EventFormWizard;
