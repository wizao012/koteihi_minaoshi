(() => {
 const form = document.querySelector('#consultation-form');
 const error = document.querySelector('#consult-error');
 const button = form.querySelector('button[type=submit]');
 const services = [...form.querySelectorAll('input[name=service]')];
 let sending = false;
 const validateServices = () => services[0].setCustomValidity(services.some(input => input.checked) ? '' : '興味のあるサービスを1つ以上お選びください');
 services.forEach(input => input.addEventListener('change', validateServices));
 validateServices();
 form.addEventListener('submit', async event => {
  event.preventDefault();
  if (sending) return;
  error.hidden = true;
  const payload = new FormData();
  for (const name of ['氏名','電話番号','メールアドレス','住所']) {
   const field = form.elements.namedItem(name);
   field.value = field.value.trim();
   if (!field.reportValidity()) return;
   payload.append(name, field.value);
  }
  validateServices();
  if (!form.reportValidity()) return;
  payload.append('興味のあるサービス', services.filter(input => input.checked).map(input => input.value).join('、'));
  payload.append('送信日時', new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }));
  payload.append('送信元URL', location.href);
  sending = true;
  button.disabled = true;
  button.textContent = '送信中';
  form.setAttribute('aria-busy', 'true');
  try {
   const response = await fetch('https://hooks.zapier.com/hooks/catch/12525485/4ukjm5z/', { method: 'POST', body: payload });
   if (!response.ok) throw new Error('Submission failed');
   window.location.href = 'thanks.html';
  } catch {
   error.textContent = '送信を確認できませんでした 時間をおいて再度お試しいただくか 050-5292-1700へお電話ください';
   error.hidden = false;
   sending = false;
   button.disabled = false;
   button.textContent = '入力内容を送信する';
  } finally {
   form.removeAttribute('aria-busy');
  }
 });
})();
