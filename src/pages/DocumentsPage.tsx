import { type FC, useState, useMemo, useRef } from 'react';
import { FileText, Eye, User, Building2, FileCheck, Printer } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import Tooltip from '../components/Tooltip';

type DocType = 'contract' | 'act' | 'invoice';

interface PersonalData {
  fullName: string;
  inn: string;
  bankName: string;
  bik: string;
  accountNumber: string;
  phone: string;
  email: string;
}

interface ClientData {
  name: string;
  inn: string;
  address: string;
}

interface DocDetails {
  serviceDescription: string;
  amount: string;
  date: string;
}

const docTypes: { value: DocType; label: string; description: string; icon: typeof FileText }[] = [
  {
    value: 'contract',
    label: 'Договор оказания услуг',
    description: 'Договор между самозанятым и заказчиком на оказание услуг',
    icon: FileText,
  },
  {
    value: 'act',
    label: 'Акт выполненных работ',
    description: 'Подтверждение выполнения работ по договору',
    icon: FileCheck,
  },
  {
    value: 'invoice',
    label: 'Счёт на оплату',
    description: 'Выставление счёта заказчику за оказанные услуги',
    icon: FileText,
  },
];

const DocumentsPage: FC = () => {
  const [docType, setDocType] = useState<DocType>('contract');
  const [showPreview, setShowPreview] = useState(false);
  const [personal, setPersonal] = useState<PersonalData>({
    fullName: '',
    inn: '',
    bankName: '',
    bik: '',
    accountNumber: '',
    phone: '',
    email: '',
  });
  const [client, setClient] = useState<ClientData>({
    name: '',
    inn: '',
    address: '',
  });
  const [details, setDetails] = useState<DocDetails>({
    serviceDescription: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });

  const previewRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!previewRef.current) return;

    const content = previewRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>${docTitle} — СамЗнаю</title>
<style>
  @page { margin: 20mm 15mm; size: A4; }
  body { font-family: 'Times New Roman', serif; font-size: 14px; line-height: 1.6; color: #000; margin: 0; padding: 0; }
  h3 { font-size: 18px; text-align: center; margin-bottom: 4px; }
  p { margin: 6px 0; }
  strong { font-weight: bold; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; }
  th, td { border: 1px solid #333; padding: 6px 10px; text-align: left; font-size: 13px; }
  th { background: #f5f5f5; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .text-center { text-align: center; }
  .text-right { text-align: right; }
  .text-sm { font-size: 12px; }
  .text-xs { font-size: 11px; }
  .mt-4 { margin-top: 16px; }
  .mt-6 { margin-top: 24px; }
  .mt-8 { margin-top: 32px; }
  .pt-4 { padding-top: 16px; }
  .border-t { border-top: 1px solid #333; }
  .font-bold { font-weight: bold; }
  .font-mono { font-family: 'Courier New', monospace; }
  .space-y-4 > * + * { margin-top: 12px; }
  .text-gray-500 { color: #666; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>${content}</body>
</html>`);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const isFormValid = useMemo(() => {
    return (
      personal.fullName.trim() !== '' &&
      personal.inn.trim() !== '' &&
      client.name.trim() !== '' &&
      details.serviceDescription.trim() !== '' &&
      details.amount.trim() !== ''
    );
  }, [personal, client, details]);

  const docTitle = useMemo(() => {
    const found = docTypes.find((d) => d.value === docType);
    return found ? found.label : '';
  }, [docType]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '___________';
    const d = new Date(dateStr);
    return d.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const renderPreview = () => {
    const name = personal.fullName || '____________________';
    const inn = personal.inn || '____________';
    const clientName = client.name || '____________________';
    const clientInn = client.inn || '____________';
    const service = details.serviceDescription || '____________________';
    const amount = details.amount || '________';
    const date = formatDate(details.date);

    if (docType === 'contract') {
      return (
        <div className="space-y-4 font-serif text-sm leading-relaxed text-gray-800 dark:text-gray-200">
          <h3 className="text-center text-lg font-bold">ДОГОВОР ОКАЗАНИЯ УСЛУГ</h3>
          <p className="text-center text-sm text-gray-500">от {date}</p>
          <p>
            Плательщик налога на профессиональный доход <strong>{name}</strong>, ИНН {inn},
            именуемый(-ая) в дальнейшем «Исполнитель», с одной стороны, и{' '}
            <strong>{clientName}</strong>, ИНН {clientInn},
            именуемый(-ая) в дальнейшем «Заказчик», с другой стороны,
            заключили настоящий договор о нижеследующем:
          </p>
          <p><strong>1. Предмет договора</strong></p>
          <p>1.1. Исполнитель обязуется оказать Заказчику следующие услуги: {service}.</p>
          <p>1.2. Заказчик обязуется оплатить услуги в размере {amount} руб.</p>
          <p><strong>2. Стоимость и порядок оплаты</strong></p>
          <p>2.1. Стоимость услуг по настоящему договору составляет {amount} (прописью) рублей. НДС не облагается (п. 9 ст. 2 ФЗ от 27.11.2018 № 422-ФЗ).</p>
          <p>2.2. Оплата производится на расчётный счёт Исполнителя в течение 5 рабочих дней после подписания Акта выполненных работ.</p>
          <p><strong>3. Статус Исполнителя</strong></p>
          <p>3.1. Исполнитель является плательщиком налога на профессиональный доход (самозанятый) в соответствии с ФЗ от 27.11.2018 № 422-ФЗ.</p>
          <p>3.2. Исполнитель самостоятельно уплачивает налог на профессиональный доход.</p>
          <p>3.3. Исполнитель обязуется предоставить чек из приложения «Мой налог» в течение 3 дней после получения оплаты.</p>
          <div className="mt-8 grid grid-cols-2 gap-8 border-t pt-4">
            <div>
              <p className="font-bold">Исполнитель:</p>
              <p>{name}</p>
              <p>ИНН: {inn}</p>
              {personal.bankName && <p>Банк: {personal.bankName}</p>}
              {personal.accountNumber && <p>Счёт: {personal.accountNumber}</p>}
              {personal.bik && <p>БИК: {personal.bik}</p>}
              <p className="mt-4">Подпись: _______________</p>
            </div>
            <div>
              <p className="font-bold">Заказчик:</p>
              <p>{clientName}</p>
              <p>ИНН: {clientInn}</p>
              {client.address && <p>Адрес: {client.address}</p>}
              <p className="mt-4">Подпись: _______________</p>
            </div>
          </div>
        </div>
      );
    }

    if (docType === 'act') {
      return (
        <div className="space-y-4 font-serif text-sm leading-relaxed text-gray-800 dark:text-gray-200">
          <h3 className="text-center text-lg font-bold">АКТ ВЫПОЛНЕННЫХ РАБОТ</h3>
          <p className="text-center text-sm text-gray-500">от {date}</p>
          <p>
            Плательщик НПД <strong>{name}</strong>, ИНН {inn} (Исполнитель) и{' '}
            <strong>{clientName}</strong>, ИНН {clientInn} (Заказчик) составили настоящий Акт о том, что:
          </p>
          <p>1. Исполнитель выполнил следующие работы/оказал следующие услуги: {service}.</p>
          <p>2. Стоимость выполненных работ/оказанных услуг составляет {amount} руб. НДС не облагается.</p>
          <p>3. Работы выполнены в полном объёме и в установленные сроки. Заказчик претензий по качеству и срокам не имеет.</p>
          <div className="mt-8 grid grid-cols-2 gap-8 border-t pt-4">
            <div>
              <p className="font-bold">Исполнитель:</p>
              <p>{name}</p>
              <p>Подпись: _______________</p>
            </div>
            <div>
              <p className="font-bold">Заказчик:</p>
              <p>{clientName}</p>
              <p>Подпись: _______________</p>
            </div>
          </div>
        </div>
      );
    }

    // invoice
    return (
      <div className="space-y-4 font-serif text-sm leading-relaxed text-gray-800 dark:text-gray-200">
        <h3 className="text-center text-lg font-bold">СЧЁТ НА ОПЛАТУ</h3>
        <p className="text-center text-sm text-gray-500">от {date}</p>
        <table className="mt-4 w-full border-collapse border border-gray-300 dark:border-gray-600">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="border border-gray-300 px-3 py-2 text-left dark:border-gray-600">Получатель</th>
              <th className="border border-gray-300 px-3 py-2 text-left dark:border-gray-600">Реквизиты</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-3 py-2 dark:border-gray-600">{name}</td>
              <td className="border border-gray-300 px-3 py-2 dark:border-gray-600">
                ИНН: {inn}<br />
                {personal.bankName && <>Банк: {personal.bankName}<br /></>}
                {personal.accountNumber && <>Р/с: {personal.accountNumber}<br /></>}
                {personal.bik && <>БИК: {personal.bik}</>}
              </td>
            </tr>
          </tbody>
        </table>
        <p><strong>Плательщик:</strong> {clientName}, ИНН {clientInn}</p>
        <table className="mt-4 w-full border-collapse border border-gray-300 dark:border-gray-600">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="border border-gray-300 px-3 py-2 dark:border-gray-600">№</th>
              <th className="border border-gray-300 px-3 py-2 text-left dark:border-gray-600">Наименование</th>
              <th className="border border-gray-300 px-3 py-2 dark:border-gray-600">Сумма</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-3 py-2 text-center dark:border-gray-600">1</td>
              <td className="border border-gray-300 px-3 py-2 dark:border-gray-600">{service}</td>
              <td className="border border-gray-300 px-3 py-2 text-right font-mono dark:border-gray-600">{amount} ₽</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="font-bold">
              <td colSpan={2} className="border border-gray-300 px-3 py-2 text-right dark:border-gray-600">Итого:</td>
              <td className="border border-gray-300 px-3 py-2 text-right font-mono dark:border-gray-600">{amount} ₽</td>
            </tr>
          </tfoot>
        </table>
        <p className="text-xs text-gray-500">НДС не облагается на основании п. 9 ст. 2 ФЗ от 27.11.2018 № 422-ФЗ</p>
        <div className="mt-6">
          <p>{name}</p>
          <p>Подпись: _______________</p>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Документы' }]} />

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-extrabold text-gray-900 dark:text-white">
          Генератор документов
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Создавайте договоры, акты и счета для работы с заказчиками
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form */}
        <div className="space-y-6">
          {/* Doc type */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
              <FileText size={20} className="text-primary-600" />
              Тип документа
            </h2>
            <div className="space-y-2">
              {docTypes.map((dt) => (
                <button
                  key={dt.value}
                  type="button"
                  onClick={() => setDocType(dt.value)}
                  className={`flex w-full items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                    docType === dt.value
                      ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/30'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                  }`}
                >
                  <dt.icon size={20} className={`mt-0.5 ${
                    docType === dt.value
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-400'
                  }`} />
                  <div>
                    <p className={`font-medium ${
                      docType === dt.value
                        ? 'text-primary-700 dark:text-primary-300'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {dt.label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{dt.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Personal data */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
              <User size={20} className="text-primary-600" />
              Ваши данные (Исполнитель)
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  ФИО полностью
                </label>
                <input
                  type="text"
                  value={personal.fullName}
                  onChange={(e) => setPersonal({ ...personal, fullName: e.target.value })}
                  placeholder="Иванов Иван Иванович"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  ИНН{' '}
                  <Tooltip text="12-значный ИНН физического лица. Можно узнать на сайте ФНС" />
                </label>
                <input
                  type="text"
                  value={personal.inn}
                  onChange={(e) => setPersonal({ ...personal, inn: e.target.value.replace(/\D/g, '').slice(0, 12) })}
                  placeholder="123456789012"
                  maxLength={12}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Телефон</label>
                <input
                  type="tel"
                  value={personal.phone}
                  onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
                  placeholder="+7 (999) 123-45-67"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Банк</label>
                <input
                  type="text"
                  value={personal.bankName}
                  onChange={(e) => setPersonal({ ...personal, bankName: e.target.value })}
                  placeholder="Сбербанк"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">БИК</label>
                <input
                  type="text"
                  value={personal.bik}
                  onChange={(e) => setPersonal({ ...personal, bik: e.target.value.replace(/\D/g, '').slice(0, 9) })}
                  placeholder="044525225"
                  maxLength={9}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Расчётный счёт</label>
                <input
                  type="text"
                  value={personal.accountNumber}
                  onChange={(e) => setPersonal({ ...personal, accountNumber: e.target.value.replace(/\D/g, '').slice(0, 20) })}
                  placeholder="40817810099910004312"
                  maxLength={20}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Client data */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
              <Building2 size={20} className="text-primary-600" />
              Данные заказчика
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Наименование / ФИО
                </label>
                <input
                  type="text"
                  value={client.name}
                  onChange={(e) => setClient({ ...client, name: e.target.value })}
                  placeholder='ООО "Компания" или ФИО'
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">ИНН</label>
                <input
                  type="text"
                  value={client.inn}
                  onChange={(e) => setClient({ ...client, inn: e.target.value.replace(/\D/g, '').slice(0, 12) })}
                  placeholder="1234567890"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Адрес</label>
                <input
                  type="text"
                  value={client.address}
                  onChange={(e) => setClient({ ...client, address: e.target.value })}
                  placeholder="г. Москва, ул. Примерная, д. 1"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Service details */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Детали</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Описание услуги
                </label>
                <textarea
                  value={details.serviceDescription}
                  onChange={(e) => setDetails({ ...details, serviceDescription: e.target.value })}
                  placeholder="Разработка дизайна логотипа"
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Сумма (руб.)
                  </label>
                  <input
                    type="text"
                    value={details.amount}
                    onChange={(e) => setDetails({ ...details, amount: e.target.value.replace(/[^\d]/g, '') })}
                    placeholder="50000"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Дата</label>
                  <input
                    type="date"
                    value={details.date}
                    onChange={(e) => setDetails({ ...details, date: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div>
          <div className="sticky top-20">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                <Eye size={20} className="text-primary-600" />
                Предпросмотр: {docTitle}
              </h2>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 lg:hidden"
              >
                {showPreview ? 'Скрыть' : 'Показать'}
              </button>
            </div>

            <div
              ref={previewRef}
              className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8 ${
                !showPreview ? 'hidden lg:block' : ''
              }`}
            >
              {renderPreview()}
            </div>

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                disabled={!isFormValid}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 font-bold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handlePrint}
              >
                <Printer size={18} />
                Печать / PDF
              </button>
            </div>
            {!isFormValid && (
              <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                Заполните обязательные поля: ФИО, ИНН, наименование заказчика, описание и сумму
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;
