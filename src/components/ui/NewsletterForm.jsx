import { useId, useState } from "react";
export default function NewsletterForm({ variant = "" }) {
  const id = useId();
  const [message, setMessage] = useState("");
  function submit(event) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email")?.trim();
    setMessage(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? "현재 뉴스레터 신청 서비스는 준비 중입니다. 입력하신 이메일은 저장되지 않습니다."
        : "올바른 이메일 주소를 입력해 주세요.",
    );
  }
  return (
    <form className={`newsletter-form ${variant}`} onSubmit={submit} noValidate>
      <div className="newsletter-field">
        <label className="sr-only" htmlFor={id}>
          이메일 주소
        </label>
        <input
          id={id}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="EMAIL"
          aria-describedby={`${id}-status`}
          aria-invalid={message.startsWith("올바른") || undefined}
          required
        />
        <button type="submit">JOIN</button>
      </div>
      <p id={`${id}-status`} className="form-status" role="status">
        {message}
      </p>
    </form>
  );
}
