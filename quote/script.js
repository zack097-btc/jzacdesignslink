/* ══════════════════════════════════════════════════════════════
   JZAC DESIGNS — QUOTE DATA
   ══════════════════════════════════════════════════════════════
   Edit everything in this section for each new customer quote,
   save the file, and refresh the page. That's it — nothing else
   on the site needs to change per quote.

   Editing rules (so you don't break anything):
   - Keep text wrapped in "double quotes"
   - Keep a comma after each line inside { } or [ ], except the
     very last one in a list
   - Don't delete any { } or [ ] brackets
   ══════════════════════════════════════════════════════════════ */

const QUOTE = {

  // ── Quote Summary ────────────────────────────────────────────
  quoteNumber: "JZ-2026-0142",
  customerName: "Riverside Auto Detailing",
  projectType: "Storefront Window Lettering + Hours Decal",
  dateIssued: "July 9, 2026",
  validUntil: "August 8, 2026",
  turnaround: "3–5 business days after art approval",
  location: "Installed on-site — Spokane, WA",
  preparedBy: "JZac Designs",

  // ── Project Scope ────────────────────────────────────────────
  scope: {
    description: "Custom single-color vinyl lettering for your storefront window, including your business name and a printed hours-of-operation decal. All graphics are cut from premium cast vinyl for a clean, long-lasting finish.",

    included: [
      "Free digital design proof for your approval before anything is cut",
      "Precision plotter-cut vinyl lettering, weeded and masked for install",
      "Printed business-hours decal for your entry door",
      "Professional on-site installation (Spokane, WA area)"
    ],

    materials: [
      "3M Scotchcal™ 7725 premium cast vinyl — rated for 7–10 years outdoors",
      "Application transfer tape for a clean, bubble-free install",
      "Surface-safe adhesive suited for glass"
    ],

    installNotes: "Installed on-site by JZac Designs for local Spokane-area customers. Out-of-area orders ship ready-to-apply with an installation guide included — no local install required.",

    customerRequirements: "Please confirm the exact spelling of your business name, phone number, and hours before you approve this quote. Make sure the window is accessible and free of old decals or residue on install day."
  },

  // ── Line Items ────────────────────────────────────────────────
  // Add or remove rows freely — each one needs item, description, qty, price
  lineItems: [
    { item: "Storefront Window Lettering", description: "Business name in single-color premium cast vinyl, approx. 40 sq ft, cut & weeded", qty: 1, price: 360.00 },
    { item: "Business Hours Decal", description: "Printed hours-of-operation decal for entry door", qty: 1, price: 85.00 },
    { item: "Design & Layout Proof", description: "Custom layout, font selection, and digital proof for your approval", qty: 1, price: 75.00 },
    { item: "Professional Installation", description: "On-site install — surface prep, application, bubble-free finish", qty: 1, price: 125.00 }
  ],

  // ── Tax, Fees & Deposit ───────────────────────────────────────
  taxRate: 0.089,   // 8.9% example rate — set to your local sales tax rate (use 0 for no tax)
  additionalFee: { label: "Shipping / Rush Fee", amount: 0 },  // leave amount at 0 to hide this row entirely
  depositPercent: 0.5   // 0.5 = 50% due at approval. Use 0 for no deposit, 1 for payment in full up front.
};

/* ══════════════════════════════════════════════════════════════
   ⚙️  RENDER LOGIC — you shouldn't need to edit anything below.
   This reads the QUOTE object above and fills in the page.
   ══════════════════════════════════════════════════════════════ */

(function () {
  const fmt = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };
  const fillList = (id, items) => {
    const ul = document.getElementById(id);
    if (!ul) return;
    ul.innerHTML = '';
    items.forEach((t) => {
      const li = document.createElement('li');
      li.textContent = t;
      ul.appendChild(li);
    });
  };

  // Hero + quote summary
  setText('heroQuoteNumber', QUOTE.quoteNumber);
  setText('heroCustomerName', QUOTE.customerName);
  setText('sQuoteNumber', QUOTE.quoteNumber);
  setText('sCustomerName', QUOTE.customerName);
  setText('sProjectType', QUOTE.projectType);
  setText('sDateIssued', QUOTE.dateIssued);
  setText('sValidUntil', QUOTE.validUntil);
  setText('sTurnaround', QUOTE.turnaround);
  setText('sLocation', QUOTE.location);
  setText('sPreparedBy', QUOTE.preparedBy);

  // Project scope
  setText('scopeDescription', QUOTE.scope.description);
  setText('scopeInstallNotes', QUOTE.scope.installNotes);
  setText('scopeCustomerRequirements', QUOTE.scope.customerRequirements);
  fillList('scopeIncluded', QUOTE.scope.included);
  fillList('scopeMaterials', QUOTE.scope.materials);

  // Line items + running subtotal
  const tbody = document.getElementById('lineItemsBody');
  let subtotal = 0;
  if (tbody) {
    tbody.innerHTML = '';
    QUOTE.lineItems.forEach((row) => {
      const lineTotal = row.qty * row.price;
      subtotal += lineTotal;

      const tr = document.createElement('tr');

      const nameCell = document.createElement('td');
      nameCell.className = 'item-name';
      nameCell.dataset.label = 'Item';
      nameCell.textContent = row.item;

      const descCell = document.createElement('td');
      descCell.className = 'desc-cell';
      descCell.dataset.label = 'Description';
      descCell.textContent = row.description;

      const qtyCell = document.createElement('td');
      qtyCell.className = 'num';
      qtyCell.dataset.label = 'Qty';
      qtyCell.textContent = row.qty;

      const priceCell = document.createElement('td');
      priceCell.className = 'num';
      priceCell.dataset.label = 'Price';
      priceCell.textContent = fmt(row.price);

      const totalCell = document.createElement('td');
      totalCell.className = 'num';
      totalCell.dataset.label = 'Line Total';
      totalCell.textContent = fmt(lineTotal);

      tr.append(nameCell, descCell, qtyCell, priceCell, totalCell);
      tbody.appendChild(tr);
    });
  }

  // Totals
  const tax = subtotal * QUOTE.taxRate;
  const fee = (QUOTE.additionalFee && QUOTE.additionalFee.amount) || 0;
  const total = subtotal + tax + fee;
  const depositPercent = QUOTE.depositPercent || 0;
  const deposit = total * depositPercent;
  const balance = total - deposit;

  setText('sumSubtotal', fmt(subtotal));
  setText('sumTaxLabel', QUOTE.taxRate > 0 ? `Tax (${(QUOTE.taxRate * 100).toFixed(1)}%)` : 'Tax');
  setText('sumTax', fmt(tax));
  setText('sumTotal', fmt(total));

  if (fee > 0) {
    const feeRow = document.getElementById('sumFeeRow');
    if (feeRow) feeRow.hidden = false;
    setText('sumFeeLabel', QUOTE.additionalFee.label);
    setText('sumFee', fmt(fee));
  }

  if (depositPercent > 0) {
    setText('sumDepositLabel', `Deposit Due at Approval (${Math.round(depositPercent * 100)}%)`);
    setText('sumDeposit', fmt(deposit));
    setText('sumBalance', fmt(balance));
  } else {
    setText('sumDepositLabel', 'Payment Due at Approval');
    setText('sumDeposit', fmt(total));
    setText('sumBalance', fmt(0));
  }

  // Keep the Approve / Question mailto links in sync with the quote number above
  const approveBtn = document.getElementById('btnApprove');
  if (approveBtn) {
    const subject = encodeURIComponent('Quote Approval - JZac Designs');
    const body = encodeURIComponent(`I approve this quote and would like to move forward. Quote Number: ${QUOTE.quoteNumber}.`);
    approveBtn.href = `mailto:JZacDesigns@proton.me?subject=${subject}&body=${body}`;
  }

  const questionBtn = document.getElementById('btnQuestion');
  if (questionBtn) {
    const subject = encodeURIComponent('Question About My Quote - JZac Designs');
    const body = encodeURIComponent(`I have a question about my quote. Quote Number: ${QUOTE.quoteNumber}.\n\nMy question: `);
    questionBtn.href = `mailto:JZacDesigns@proton.me?subject=${subject}&body=${body}`;
  }
})();
