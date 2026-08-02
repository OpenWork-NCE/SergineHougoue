import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/svelte";
import ContactForm from "$components/forms/ContactForm.svelte";
import { getFormCopy } from "$i18n/forms";

describe("<ContactForm>", () => {
  const copy = getFormCopy("fr");

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders all fields with localized labels", () => {
    render(ContactForm, { props: { locale: "fr" } });

    expect(screen.getByLabelText(copy.fields.name)).toBeInTheDocument();
    expect(screen.getByLabelText(copy.fields.phone)).toBeInTheDocument();
    expect(screen.getByLabelText(copy.fields.email)).toBeInTheDocument();
    expect(screen.getByLabelText(copy.fields.intent)).toBeInTheDocument();
    expect(screen.getByLabelText(copy.fields.message)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: copy.submit }),
    ).toBeInTheDocument();
  });

  it("shows validation errors on empty submit but not for optional message", async () => {
    render(ContactForm, { props: { locale: "fr" } });

    await fireEvent.click(screen.getByRole("button", { name: copy.submit }));

    expect(screen.getByText(copy.validation.nameRequired)).toBeInTheDocument();
    expect(screen.getByText(copy.validation.phoneMin)).toBeInTheDocument();
    expect(screen.getByText(copy.validation.emailInvalid)).toBeInTheDocument();
    expect(screen.getByText(copy.validation.intentRequired)).toBeInTheDocument();
    expect(screen.queryByText(copy.validation.messageMax)).not.toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("labels message as optional in FR and EN", () => {
    const { unmount } = render(ContactForm, { props: { locale: "fr" } });
    expect(screen.getByLabelText("Message (optionnel)")).toBeInTheDocument();
    unmount();

    render(ContactForm, { props: { locale: "en" } });
    expect(screen.getByLabelText("Message (optional)")).toBeInTheDocument();
  });

  it("submits successfully without a message when fetch is mocked", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    } as Response);

    render(ContactForm, { props: { locale: "fr" } });

    await fireEvent.input(screen.getByLabelText(copy.fields.name), {
      target: { value: "Jane Doe" },
    });
    await fireEvent.input(screen.getByLabelText(copy.fields.phone), {
      target: { value: "4384626015" },
    });
    await fireEvent.input(screen.getByLabelText(copy.fields.email), {
      target: { value: "jane@example.com" },
    });
    await fireEvent.change(screen.getByLabelText(copy.fields.intent), {
      target: { value: "buy" },
    });
    // leave message empty

    await fireEvent.click(screen.getByRole("button", { name: copy.submit }));

    await waitFor(() => {
      expect(screen.getByTestId("contact-form-success")).toHaveTextContent(
        copy.success,
      );
    });

    expect(fetch).toHaveBeenCalledWith("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Jane Doe",
        phone: "4384626015",
        email: "jane@example.com",
        intent: "buy",
        message: "",
      }),
    });
  });

  it("shows success state after a successful submission", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    } as Response);

    render(ContactForm, { props: { locale: "fr" } });

    await fireEvent.input(screen.getByLabelText(copy.fields.name), {
      target: { value: "Jane Doe" },
    });
    await fireEvent.input(screen.getByLabelText(copy.fields.phone), {
      target: { value: "4384626015" },
    });
    await fireEvent.input(screen.getByLabelText(copy.fields.email), {
      target: { value: "jane@example.com" },
    });
    await fireEvent.change(screen.getByLabelText(copy.fields.intent), {
      target: { value: "buy" },
    });
    await fireEvent.input(screen.getByLabelText(copy.fields.message), {
      target: { value: "Je souhaite acheter une propriété à Montréal." },
    });

    await fireEvent.click(screen.getByRole("button", { name: copy.submit }));

    await waitFor(() => {
      expect(screen.getByTestId("contact-form-success")).toHaveTextContent(
        copy.success,
      );
    });

    expect(fetch).toHaveBeenCalledWith("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Jane Doe",
        phone: "4384626015",
        email: "jane@example.com",
        intent: "buy",
        message: "Je souhaite acheter une propriété à Montréal.",
      }),
    });
  });

  it("shows a form error when the API fails", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({
        ok: false,
        errors: { _form: ["Resend API error"] },
      }),
    } as Response);

    render(ContactForm, { props: { locale: "fr" } });

    await fireEvent.input(screen.getByLabelText(copy.fields.name), {
      target: { value: "Jane Doe" },
    });
    await fireEvent.input(screen.getByLabelText(copy.fields.phone), {
      target: { value: "4384626015" },
    });
    await fireEvent.input(screen.getByLabelText(copy.fields.email), {
      target: { value: "jane@example.com" },
    });
    await fireEvent.change(screen.getByLabelText(copy.fields.intent), {
      target: { value: "buy" },
    });
    await fireEvent.input(screen.getByLabelText(copy.fields.message), {
      target: { value: "Je souhaite acheter une propriété à Montréal." },
    });

    await fireEvent.click(screen.getByRole("button", { name: copy.submit }));

    await waitFor(() => {
      expect(screen.getByTestId("contact-form-error")).toHaveTextContent(
        "Resend API error",
      );
    });
  });
});