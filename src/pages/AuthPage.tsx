import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CountryDialCode, fetchCountryDialCodes } from "../api/countries";
import Layout from "../components/Layout";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { loginSucceeded } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/Button";
import Input from "../components/Input";

const phoneSchema = z.object({
  countryCode: z.string().min(1, "Required"),
  phone: z
    .string()
    .min(7, "Too short")
    .max(15, "Too long")
    .regex(/^\d+$/, "Digits only"),
});

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "Enter 6 digits")
    .regex(/^\d{6}$/),
});

type PhoneForm = z.infer<typeof phoneSchema>;

type OtpForm = z.infer<typeof otpSchema>;

export default function AuthPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [countries, setCountries] = useState<CountryDialCode[]>([]);
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifying, setVerifying] = useState(false);
  // Remove generatedOtp; we will allow any 6-digit code and prefill a fixed code after 5s
  const [selected, setSelected] = useState<PhoneForm>({
    countryCode: "",
    phone: "",
  });
  // Countdown state and timer refs for OTP prefill
  const [otpCountdown, setOtpCountdown] = useState<number | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);
  const autofillTimeoutRef = useRef<number | null>(null);

  const phoneForm = useForm<PhoneForm>({
    resolver: zodResolver(phoneSchema),
    defaultValues: selected,
  });
  const otpForm = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  useEffect(() => {
    fetchCountryDialCodes()
      .then(setCountries)
      .catch(() => setCountries([]));
  }, []);

  const countryOptions = useMemo(
    () =>
      countries.map((country) => (
        <option key={country.cca2} value={country.callingCode}>
          {country.name} ({country.callingCode})
        </option>
      )),
    [countries]
  );

  function clearOtpTimers() {
    if (countdownIntervalRef.current !== null) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (autofillTimeoutRef.current !== null) {
      clearTimeout(autofillTimeoutRef.current);
      autofillTimeoutRef.current = null;
    }
  }

  useEffect(() => {
    return () => {
      clearOtpTimers();
    };
  }, []);

  function sendOtp(values: PhoneForm) {
    setSendingOtp(true);
    setSelected(values);

    setTimeout(async () => {
      setSendingOtp(false);
      toast.success(`OTP sent to ${values.countryCode} ${values.phone}`);
      setStep("otp");

      // Start a 5s countdown and then prefill a fixed OTP without auto-submitting
      setOtpCountdown(5);
      countdownIntervalRef.current = window.setInterval(() => {
        setOtpCountdown((prev) => {
          if (prev === null) return null;
          return prev > 0 ? prev - 1 : 0;
        });
      }, 1000);

      autofillTimeoutRef.current = window.setTimeout(() => {
        // Prefill a fixed code to avoid random generation
        otpForm.setValue("otp", "123321");
        clearOtpTimers();
        setOtpCountdown(0);
      }, 5000);
    }, 1000);
  }

  function verifyOtp(values: OtpForm) {
    setVerifying(true);
    setTimeout(async () => {
      setVerifying(false);
      // Accept any 6-digit input (schema already validates format)
      toast.success("Logged in successfully");
      dispatch(
        loginSucceeded({
          countryCode: selected.countryCode,
          phone: selected.phone,
        })
      );
      navigate("/");
    }, 1000);
  }

  return (
    <Layout mainClassName="py-0">
      <div className="min-h-[calc(100vh-56px)] md:min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Sign in
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
            OTP-based login with country code.
          </p>
          {step === "phone" && (
            <form
              onSubmit={phoneForm.handleSubmit(sendOtp)}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm mb-1 text-gray-700 dark:text-gray-200">
                  Country code
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 px-3 py-2"
                  {...phoneForm.register("countryCode")}
                >
                  <option className="text-gray-900 dark:text-gray-200" value="">
                    Select
                  </option>
                  {countryOptions}
                </select>
                {phoneForm.formState.errors.countryCode && (
                  <p className="text-xs text-red-600 mt-1">
                    {phoneForm.formState.errors.countryCode.message}
                  </p>
                )}
              </div>
              <Input
                label="Phone number"
                type="tel"
                inputMode="numeric"
                placeholder="1234567890"
                className="text-gray-900 dark:text-gray-200"
                error={phoneForm.formState.errors.phone?.message}
                {...phoneForm.register("phone")}
              />
              <Button type="submit" fullWidth isLoading={sendingOtp}>
                {sendingOtp ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>
          )}
          {step === "otp" && (
            <form
              onSubmit={otpForm.handleSubmit(verifyOtp)}
              className="space-y-4"
            >
              <Input
                label="Enter OTP"
                type="text"
                inputMode="numeric"
                maxLength={6}
                className="tracking-widest text-center text-gray-900 dark:text-gray-200"
                placeholder="••••••"
                error={otpForm.formState.errors.otp?.message}
                {...otpForm.register("otp")}
              />
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-800 dark:text-gray-300"
                  onClick={() => {
                    clearOtpTimers();
                    setOtpCountdown(null);
                    setStep("phone");
                  }}
                >
                  Back
                </Button>
                <Button type="submit" isLoading={verifying}>
                  {verifying ? "Verifying..." : "Verify"}
                </Button>
              </div>
              {otpCountdown !== null && otpCountdown > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Auto-fill in {otpCountdown}s
                </p>
              )}
              {otpCountdown === 0 && (
                <p className="text-xs text-gray-500 mt-1">Code auto-filled.</p>
              )}
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
