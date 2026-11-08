// Demo enquiry: validate, then say plainly that nothing was sent.
// No fetch, no storage, no analytics.
const PHONE = /^[+\d][\d\s\-()]{5,}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validate(v: { name: string; email: string; phone: string; interest: string; message: string }) {
  const e: Record<string, string> = {};
  if (!v.name.trim()) e.name = 'name';
  if (!v.email.trim()) e.email = 'email';
  else if (!EMAIL.test(v.email.trim())) e.email = 'emailFormat';
  if (v.phone.trim() && !PHONE.test(v.phone.trim())) e.phone = 'phone';
  if (!v.interest) e.interest = 'interest';
  if (v.message.length > 1000) e.message = 'message';
  return e;
}

document.querySelectorAll<HTMLFormElement>('form[data-enquiry]').forEach((form) => {
  const msgs = JSON.parse(form.dataset.errors!) as Record<string, string>;
  const status = form.querySelector<HTMLElement>('[data-status]')!;
  const field = (n: string) => form.elements.namedItem(n) as HTMLInputElement;

  const showErrors = (errs: Record<string, string>) => {
    for (const n of ['name', 'email', 'phone', 'interest', 'message']) {
      const el = field(n);
      const out = document.getElementById(`${form.id}-${n}-err`)!;
      out.textContent = errs[n] ? msgs[errs[n]] : '';
      if (errs[n]) el.setAttribute('aria-invalid', 'true');
      else el.removeAttribute('aria-invalid');
    }
  };

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const errs = validate({
      name: field('name').value,
      email: field('email').value,
      phone: field('phone').value,
      interest: field('interest').value,
      message: field('message').value,
    });
    showErrors(errs);
    const n = Object.keys(errs).length;
    status.className = 'form-status';
    status.replaceChildren();
    if (n) {
      status.classList.add('is-error');
      status.textContent = n === 1 ? form.dataset.summaryOne! : form.dataset.summaryMany!.replace('{n}', String(n));
      field(Object.keys(errs)[0]).focus();
      return;
    }
    const strong = document.createElement('strong');
    strong.textContent = form.dataset.demoTitle!;
    const p = document.createElement('span');
    p.textContent = form.dataset.demoBody!;
    status.classList.add('is-demo');
    status.append(strong, p);
    status.focus();
  });

  // Clear a field's error as soon as it is fixed.
  form.addEventListener('input', (ev) => {
    const el = ev.target as HTMLInputElement;
    if (el.getAttribute('aria-invalid') !== 'true') return;
    const errs = validate({
      name: field('name').value, email: field('email').value, phone: field('phone').value,
      interest: field('interest').value, message: field('message').value,
    });
    if (!errs[el.name]) {
      el.removeAttribute('aria-invalid');
      document.getElementById(`${form.id}-${el.name}-err`)!.textContent = '';
    }
  });
});
