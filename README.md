# 🍽️ Food Fiesta (Bhojika) – Modern Restaurant Management System

An enterprise-grade, full-stack restaurant management application designed to organize and automate restaurant operations from kitchen order taking and real-time order tracking to payment settlements, customer refunds, complaints ticketing, diner feedback, and business analytics.

Developed using **Python**, **Django REST Framework (DRF)**, **MySQL 8.0**, **React 19**, and **modern JavaScript**.

---

## 🚀 Key Highlights & Tech Stack

| Tier | Technologies | Role & Features |
| :--- | :--- | :--- |
| **Backend REST API** | **Python 3.14**, **Django 6.0**, **Django REST Framework (DRF) 3.17** | Complete RESTful API with ModelViewSets, serializers, nested models, auto-calculated totals, audit logs, and SQL analytics. |
| **Database** | **MySQL 8.0** (`food_fiesta` schema) via **PyMySQL** | Stored procedures (`insert_order`, `insert_user`), triggers (`trg_order_log`, `trg_order_status`, `trg_return_status`, `trg_refund_payment`), and analytical window functions (`DENSE_RANK()`). |
| **Modern Frontend** | **React 19**, **Vite**, **Tailwind CSS**, **Lucide React**, **Axios** | Interactive Single Page Application (SPA) with live metrics, order creation wizards, customer drawers, modal workflows, and responsive UI. |
| **Interactive JS** | **Vanilla JavaScript (ES6+)**, Fetch API, CSV Generator | Enhanced multi-page HTML/JS interface with real-time DOM manipulation, dynamic filtering, print-friendly reports, and client-side CSV exports. |

---

## 📁 Project Structure

```text
bhojika1/
├── backend/                               # Django REST Framework Backend
│   ├── api/                               # DRF API App
│   │   ├── models.py                      # Django models mapped to MySQL tables (user1, orders1, etc.)
│   │   ├── serializers.py                 # Serializers with nested customer/order details
│   │   ├── views.py                       # ViewSets & dashboard/analytics endpoints
│   │   └── urls.py                        # REST Router and API routes
│   ├── food_fiesta_backend/               # Django project core
│   │   ├── settings.py                    # MySQL DB config, CORS, DRF configuration
│   │   ├── urls.py                        # Root API dispatcher
│   │   └── wsgi.py
│   ├── database.py                        # Legacy MySQL connector helper
│   ├── init_db.py                         # MySQL schema & health check utility
│   ├── food_fiesta.sql                    # MySQL schema, stored procedures, & seed data
│   ├── requirements.txt                   # Python dependencies
│   └── manage.py
│
├── frontend-react/                        # Modern React 19 SPA
│   ├── src/
│   │   ├── components/                    # Navbar, Sidebar, Toast notifications
│   │   ├── views/                         # Dashboard, Users, Orders, Payments,
│   │   │                                  # Returns, Refunds, Complaints, Feedback,
│   │   │                                  # Order Tracking, Analytics, Workflow Guide
│   │   ├── api.js                         # Centralized Axios API service layer
│   │   ├── App.jsx                        # Root React component & state manager
│   │   └── main.jsx
│   ├── dist/                              # Compiled production build
│   └── package.json
│
├── frontend/                              # Enhanced Vanilla JavaScript Frontend
│   ├── users/                             # Users view & dynamic user.js
│   ├── orders/                            # Orders table & dynamic orders.js
│   ├── payments/                          # Payments ledger & payments.js
│   ├── returns/                           # Returns desk & returns.js
│   ├── refund/                            # Refunds tracker & refund.js
│   ├── Complaints/                        # Complaints ticketing & complaints.js
│   ├── feedback/                          # Star rating reviews & feedback.js
│   ├── status/                            # Order tracking timeline & status.js
│   ├── report/                            # Analytics & CSV export report.js
│   └── workflow/                          # Process flow visualizer
│
├── index.html                             # Dynamic Operations Dashboard
├── food_fiesta.sql                        # Root SQL backup
├── run_backend.bat                        # One-click Django API launcher
├── run_frontend.bat                       # One-click React SPA launcher
└── start_all.bat                          # One-click launch for whole system
```

---

## ⚡ Quick Start

### 1. Prerequisites
- **Python 3.10+** (Python 3.14 recommended)
- **Node.js 18+** & **npm**
- **MySQL 8.0+** running locally on port 3306

### 2. Configure & Verify Database
Ensure MySQL service is running. You can verify and inspect the database with:
```powershell
python backend/init_db.py
```
*Default credentials:* `root` / `Kavya@123google` on `localhost:3306`, database `food_fiesta`. You can customize them using environment variables (`DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_HOST`).

### 3. Launch Backend (Django REST Framework)
```powershell
cd backend
python manage.py runserver 0.0.0.0:8000
```
- API Root: `http://localhost:8000/`
- API Documentation / Endpoints: `http://localhost:8000/api/`
- Django Admin: `http://localhost:8000/admin/`

### 4. Launch React Frontend
```powershell
cd frontend-react
npm run dev
```
- React SPA will open at `http://localhost:5173/`

### 5. Launch Everything Together (Windows)
Double click `start_all.bat` to launch both the backend API and the React frontend in separate windows.

---

## 📡 REST API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/dashboard/stats/` | `GET` | Aggregated executive KPIs, revenue metrics, top-selling items, and status distributions |
| `/api/analytics/` | `GET` | Advanced SQL customer spending rankings (`DENSE_RANK()`) and high-value orders |
| `/api/users/` | `GET`, `POST` | List (with search) and create customer profiles |
| `/api/users/{id}/` | `GET`, `PUT`, `DELETE` | Retrieve, update, or remove customer |
| `/api/users/{id}/orders/` | `GET` | Retrieve order history for a specific customer |
| `/api/orders/` | `GET`, `POST` | List orders (with search/filters) and place new order with auto price/discount calculation |
| `/api/orders/{id}/update_status/` | `POST` | Transition order status (`pending`, `preparing`, `completed`, `returned`) |
| `/api/payments/` | `GET`, `POST` | Payment transaction ledger |
| `/api/payments/{id}/mark_status/`| `POST` | Update payment settlement status (`completed`, `refunded`, etc.) |
| `/api/returns/` | `GET`, `POST` | Order return management with automatic status update |
| `/api/refunds/` | `GET`, `POST` | Customer refund tracking with payment ledger syncing |
| `/api/complaints/` | `GET`, `POST`, `DELETE` | Quality complaints and customer resolution ticketing |
| `/api/feedback/` | `GET`, `POST` | 1-5 star reviews with rating distributions |
| `/api/feedback/summary/` | `GET` | Average rating score and star counts |
| `/api/status/` | `GET` | Order lifecycle milestones |
| `/api/order-logs/` | `GET` | Chronological audit trail of restaurant actions |

---

## 🛠️ Developed Features

1. **Reactive Total Price Engine**: Real-time formula `Total = (Quantity × Unit Price) - Discount` calculated both client-side and verified server-side.
2. **Audit Logging & Triggers**: Whenever an order is created, returned, or refunded, status changes and event logs are recorded automatically.
3. **Interactive Visual Stepper**: Timeline reflecting orders progressing through *Order Placed* → *Kitchen Prep* → *Completed / Delivered* (or *Returned*).
4. **Window Function Analytics**: Customer ranking reports based on cumulative expenditure using SQL `DENSE_RANK() OVER(ORDER BY total_spent DESC)`.
5. **Dual Interface**:
   - **React 19 SPA**: Single-page application with modern component architecture, Lucide icons, and toast notifications.
   - **Enhanced Vanilla JS**: Classical multi-page HTML interface enhanced with modern ES6 `fetch()`, asynchronous DOM updates, and client-side CSV downloads.

---

## 👤 Author
**Kavya Kanchi**  
GitHub: [@kanchikavya](https://github.com/kanchikavya)
