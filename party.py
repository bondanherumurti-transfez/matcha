import os
import random
import zipfile
from datetime import date
from calendar import monthrange
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill
from openpyxl.utils import get_column_letter

random.seed(2026)

OUT = "Mock_Startup_Data"
os.makedirs(OUT, exist_ok=True)

COMPANIES = [
    {
        "name": "CloudFlow Technologies",
        "code": "CFT",
        "industry": "B2B SaaS",
        "revenue": 1_200_000,
        "growth": 0.025,
        "cash": 900_000,
        "capex": 6500,
        "cogs": 0.12,
        "payroll": 35000,
        "rent": 4500,
        "cloud": 8500,
        "marketing": 6500,
        "other": 5000
    },
    {
        "name": "GreenCart",
        "code": "GRC",
        "industry": "E-commerce",
        "revenue": 8_000_000,
        "growth": 0.035,
        "cash": 2_500_000,
        "capex": 25000,
        "cogs": 0.48,
        "payroll": 95000,
        "rent": 12000,
        "cloud": 7000,
        "marketing": 45000,
        "other": 18000
    },
    {
        "name": "NovaPay",
        "code": "NVP",
        "industry": "Fintech",
        "revenue": 15_000_000,
        "growth": 0.04,
        "cash": 5_000_000,
        "capex": 35000,
        "cogs": 0.22,
        "payroll": 180000,
        "rent": 18000,
        "cloud": 18000,
        "marketing": 55000,
        "other": 35000
    },
    {
        "name": "MediTrack",
        "code": "MDT",
        "industry": "Healthtech",
        "revenue": 2_500_000,
        "growth": 0.025,
        "cash": 1_400_000,
        "capex": 12000,
        "cogs": 0.20,
        "payroll": 65000,
        "rent": 7500,
        "cloud": 9000,
        "marketing": 8000,
        "other": 12000
    }
]

ACCOUNTS = [
    (1000, "Cash", "Asset"),
    (1500, "Property and Equipment", "Asset"),
    (1590, "Accumulated Depreciation", "Contra Asset"),
    (3000, "Common Stock", "Equity"),
    (3100, "Retained Earnings", "Equity"),
    (4000, "Revenue", "Revenue"),
    (5000, "Cost of Revenue", "Expense"),
    (6100, "Payroll Expense", "Expense"),
    (6200, "Rent Expense", "Expense"),
    (6300, "Technology Expense", "Expense"),
    (6400, "Marketing Expense", "Expense"),
    (6500, "General and Administrative", "Expense"),
    (6600, "Depreciation Expense", "Expense")
]

VENDOR_TYPES = {
    "COGS": ["Product Suppliers", "Packaging Suppliers",
             "Inventory Suppliers", "Logistics"],
    "Payroll": ["Payroll Services", "Recruiting", "Benefits"],
    "Rent": ["Office Leasing", "Facilities"],
    "Cloud": ["Cloud Infrastructure", "Software",
              "Cybersecurity", "IT Services"],
    "Marketing": ["Digital Advertising", "Marketing Agency",
                  "Public Relations"],
    "Other": ["Legal", "Accounting", "Insurance",
              "Consulting", "Office Supplies"]
}

FIRST = ["Apex", "Summit", "BluePeak", "Vertex", "Northstar",
         "Pioneer", "Atlas", "BrightPath", "Evergreen", "Silverline",
         "Meridian", "Cobalt", "Redwood", "Quantum", "Oakridge"]
SECOND = ["Solutions", "Services", "Partners", "Systems",
          "Group", "Consulting", "Technologies", "Global"]
VENDOR_CATEGORIES = [
    "COGS", "Payroll", "Rent", "Cloud", "Marketing", "Other"
]

def vendors_for(company):
    records = []
    for i in range(40):
        category = VENDOR_CATEGORIES[i % 6]
        name = random.choice(FIRST) + " " + random.choice(SECOND)
        records.append({
            "Vendor ID": f"{company['code']}-VEN-{i+1:03}",
            "Vendor Name": f"{name} {i+1}",
            "Category": category,
            "Address": f"{100+i} Market Street, New York, NY, USA",
            "Contact": f"Contact {i+1}",
            "Email": f"vendor{i+1}@example.com",
            "Payment Terms": random.choice(
                ["Net 15", "Net 30", "Net 45", "Due on Receipt"]),
            "Currency": "USD",
            "Status": random.choice(["Active", "Active", "Active", "Inactive"]),
            "Tax ID": f"SYN-{company['code']}-{i+1000:05}",
            "Bank Account": f"TEST-{company['code']}-{i+1000:06}"
        })
    return records

def build_company(c):
    code = c["code"]
    vendors = vendors_for(c)
    vendor_groups = {
        cat: [v for v in vendors if v["Category"] == cat]
        for cat in VENDOR_CATEGORIES
    }

    gl = []
    vendor_tx = []
    monthly = []
    cash = c["cash"]
    common_stock = c["cash"]
    gross_ppe = 0
    accum_dep = 0
    retained = 0
    cumulative_net_income = 0

    def post(dt, journal, description, account, debit, credit,
             vendor=None):
        gl.append([
            dt, journal, description, account,
            next(a[1] for a in ACCOUNTS if a[0] == account),
            vendor or "", round(debit, 2), round(credit, 2)
        ])

    def entry(dt, journal, description, debit_account,
              credit_account, amount, vendor=None):
        post(dt, journal, description, debit_account,
             amount, 0, vendor)
        post(dt, journal, description, credit_account,
             0, amount, vendor)

    # Opening balance: funded entirely by initial equity.
    post(date(2024, 12, 31), "OPEN-001", "Initial founder/investor funding",
         1000, cash, 0)
    post(date(2024, 12, 31), "OPEN-001", "Initial founder/investor funding",
         3000, 0, common_stock)

    monthly_vendor_rows = []
    monthly_gl_start = 1

    for m in range(24):
        year = 2025 + m // 12
        month = m % 12 + 1
        dt = date(year, month, monthrange(year, month)[1])
        factor = (1 + c["growth"]) ** m
        revenue = c["revenue"] / 12 * factor * random.uniform(.94, 1.06)

        # A later equity financing round for each company.
        funding = 0
        if m == 9:
            funding = c["cash"] * .30
            entry(dt, f"{code}-{m+1:03}-FUND",
                  "Series financing / investor capital",
                  1000, 3000, funding)
            cash += funding
            common_stock += funding

        expenses = {
            "COGS": revenue * c["cogs"] * random.uniform(.96, 1.04),
            "Payroll": c["payroll"] * factor * random.uniform(.97, 1.03),
            "Rent": c["rent"] * random.uniform(.99, 1.01),
            "Cloud": c["cloud"] * factor * random.uniform(.94, 1.06),
            "Marketing": c["marketing"] * factor * random.uniform(.85, 1.15),
            "Other": c["other"] * factor * random.uniform(.90, 1.10)
        }

        # Revenue collected in cash.
        entry(dt, f"{code}-{m+1:03}-REV",
              "Customer revenue receipts", 1000, 4000, revenue)
        cash += revenue

        # Vendor-level operating expense transactions.
        expense_accounts = {
            "COGS": 5000,
            "Payroll": 6100,
            "Rent": 6200,
            "Cloud": 6300,
            "Marketing": 6400,
            "Other": 6500
        }

        for category, total in expenses.items():
            count = 2 if category in ["Payroll", "Rent"] else 3
            splits = [random.random() for _ in range(count)]
            splits = [x / sum(splits) for x in splits]

            for j, fraction in enumerate(splits):
                amount = round(total * fraction, 2)
                vendor = random.choice(vendor_groups[category])
                journal = f"{code}-{m+1:03}-{category[:3]}-{j+1}"

                entry(dt, journal, f"{category} payment",
                      expense_accounts[category], 1000,
                      amount, vendor["Vendor ID"])
                cash -= amount

                vendor_tx.append([
                    f"INV-{code}-{year}{month:02}-{len(vendor_tx)+1:04}",
                    vendor["Vendor ID"], vendor["Vendor Name"],
                    dt, dt, category, amount, amount, 0,
                    "Paid", "USD"
                ])

        # Capital expenditure.
        capex = c["capex"] * factor * random.uniform(.85, 1.15)
        entry(dt, f"{code}-{m+1:03}-CAP",
              "Equipment and capital purchases",
              1500, 1000, capex)
        cash -= capex
        gross_ppe += capex

        # Monthly straight-line depreciation approximation.
        depreciation = c["capex"] * .12
        entry(dt, f"{code}-{m+1:03}-DEP",
              "Monthly depreciation", 6600, 1590, depreciation)
        accum_dep += depreciation

        total_opex = sum(expenses.values())
        gross_profit = revenue - expenses["COGS"]
        ebitda = gross_profit - (
            total_opex - expenses["COGS"]
        )
        net_income = revenue - total_opex - depreciation

        retained += net_income
        cumulative_net_income += net_income

        cfo = net_income + depreciation
        cfi = -capex
        cff = funding

        monthly.append({
            "Month": dt,
            "Revenue": revenue,
            "COGS": expenses["COGS"],
            "Gross Profit": gross_profit,
            "Payroll": expenses["Payroll"],
            "Rent": expenses["Rent"],
            "Technology": expenses["Cloud"],
            "Marketing": expenses["Marketing"],
            "G&A": expenses["Other"],
            "EBITDA": ebitda,
            "Depreciation": depreciation,
            "Net Income": net_income,
            "CFO": cfo,
            "CFI": cfi,
            "CFF": cff,
            "Ending Cash": cash,
            "Gross PPE": gross_ppe,
            "Accumulated Depreciation": accum_dep,
            "Net PPE": gross_ppe - accum_dep,
            "Common Stock": common_stock,
            "Retained Earnings": retained,
            "Total Assets": cash + gross_ppe - accum_dep,
            "Total Equity": common_stock + retained
        })

    # Build monthly trial balance from monthly statement balances.
    tb = []
    for p in monthly:
        balances = {
            1000: p["Ending Cash"],
            1500: p["Gross PPE"],
            1590: -p["Accumulated Depreciation"],
            3000: -p["Common Stock"],
            3100: -p["Retained Earnings"],
            4000: -p["Revenue"],
            5000: p["COGS"],
            6100: p["Payroll"],
            6200: p["Rent"],
            6300: p["Technology"],
            6400: p["Marketing"],
            6500: p["G&A"],
            6600: p["Depreciation"]
        }

        # Revenue and expenses are cumulative in a year-to-date TB.
        # Use cumulative account activity through the reporting month.
        idx = monthly.index(p)
        cum = {a[0]: 0 for a in ACCOUNTS}
        for prior in monthly[:idx+1]:
            cum[4000] -= prior["Revenue"]
            cum[5000] += prior["COGS"]
            cum[6100] += prior["Payroll"]
            cum[6200] += prior["Rent"]
            cum[6300] += prior["Technology"]
            cum[6400] += prior["Marketing"]
            cum[6500] += prior["G&A"]
            cum[6600] += prior["Depreciation"]

        # Close income statement accounts to retained earnings monthly.
        balances.update({a: 0 for a in range(4000, 6700, 100)})
        balances[3100] = -p["Retained Earnings"]
        for a, value in cum.items():
            if a >= 4000:
                balances[a] = value

        # Closing entry is reflected in retained earnings.
        for acc, bal in balances.items():
            account = next(a for a in ACCOUNTS if a[0] == acc)
            debit = max(bal, 0)
            credit = max(-bal, 0)
            if debit or credit:
                tb.append([
                    p["Month"], acc, account[1],
                    round(debit, 2), round(credit, 2)
                ])

    # Create Excel workbook.
    wb = Workbook()
    wb.remove(wb.active)

    def sheet(name, headers, rows):
        ws = wb.create_sheet(name)
        ws.append(headers)
        for row in rows:
            ws.append(list(row))
        ws.freeze_panes = "A2"
        ws.auto_filter.ref = ws.dimensions
        for cell in ws[1]:
            cell.font = Font(bold=True, color="FFFFFF")
            cell.fill = PatternFill("solid", fgColor="24476B")
        for col in ws.columns:
            width = min(max(max(
                len(str(cell.value or "")) for cell in col
            ) + 2, 12), 32)
            ws.column_dimensions[
                get_column_letter(col[0].column)
            ].width = width
        return ws

    sheet("Read_Me",
          ["Field", "Value"],
          [
              ["Company", c["name"]],
              ["Industry", c["industry"]],
              ["Period", "January 2025 - December 2026"],
              ["Currency", "USD"],
              ["Data Type", "Entirely synthetic"],
              ["Accounting", "Double-entry; cash-paid expenses"],
              ["Revenue", "Cash collected at time of sale"],
              ["Vendors", "40 fictional vendors"],
              ["Limitations", "No taxes, debt, AR, inventory or AP balances"],
              ["Reconciliation", "Assets = Equity; cash flow ties to cash"]
          ])

    sheet("Chart_of_Accounts",
          ["Account Number", "Account Name", "Account Type"],
          ACCOUNTS)

    sheet("General_Ledger",
          ["Date", "Journal ID", "Description", "Account Number",
           "Account Name", "Vendor ID", "Debit", "Credit"],
          gl)

    sheet("Trial_Balance",
          ["Month", "Account Number", "Account Name",
           "Debit Balance", "Credit Balance"], tb)

    is_rows = []
    bs_rows = []
    cf_rows = []

    for p in monthly:
        is_rows.append([
            p["Month"], p["Revenue"], p["COGS"],
            p["Gross Profit"], p["Payroll"], p["Rent"],
            p["Technology"], p["Marketing"], p["G&A"],
            p["EBITDA"], p["Depreciation"], p["Net Income"]
        ])

        bs_rows.append([
            p["Month"], p["Ending Cash"], p["Gross PPE"],
            p["Accumulated Depreciation"], p["Net PPE"],
            p["Total Assets"], 0, 0,
            p["Common Stock"], p["Retained Earnings"],
            p["Total Equity"], p["Total Equity"]
        ])

        cf_rows.append([
            p["Month"], p["Net Income"], p["Depreciation"],
            p["CFO"], p["CFI"], p["CFF"],
            p["CFO"] + p["CFI"] + p["CFF"],
            p["Ending Cash"]
        ])

    sheet("Income_Statement",
          ["Month", "Revenue", "COGS", "Gross Profit",
           "Payroll", "Rent", "Technology", "Marketing",
           "G&A", "EBITDA", "Depreciation", "Net Income"],
          is_rows)

    sheet("Balance_Sheet",
          ["Month", "Cash", "Gross PPE", "Accumulated Depreciation",
           "Net PPE", "Total Assets", "Accounts Receivable",
           "Inventory", "Common Stock", "Retained Earnings",
           "Total Equity", "Total Liabilities and Equity"],
          bs_rows)

    sheet("Cash_Flow",
          ["Month", "Net Income", "Depreciation",
           "Cash from Operations", "Cash from Investing",
           "Cash from Financing", "Net Change in Cash",
           "Ending Cash"],
          cf_rows)

    sheet("Vendor_Master",
          list(vendors[0].keys()),
          [list(v.values()) for v in vendors])

    sheet("Vendor_Transactions",
          ["Invoice ID", "Vendor ID", "Vendor Name",
           "Invoice Date", "Payment Date", "Category",
           "Invoice Amount", "Paid Amount", "Outstanding",
           "Status", "Currency"],
          vendor_tx)

    filename = os.path.join(OUT, f"{code}_Financial_Data.xlsx")
    wb.save(filename)
    print("Created:", filename)

for company in COMPANIES:
    build_company(company)

# Package all four workbooks into one ZIP.
zip_name = "Four_Startup_Mock_Data_Package.zip"
with zipfile.ZipFile(zip_name, "w", zipfile.ZIP_DEFLATED) as z:
    for filename in os.listdir(OUT):
        z.write(os.path.join(OUT, filename), filename)

print("\nCompleted:", zip_name)


