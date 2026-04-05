# 🚀 24/7 Keep-Alive Setup Guide

## **Option 1: Render Starter Plan (Best)**

### **Steps:**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select each service
3. Settings → Plan → Upgrade to Starter ($7/month)
4. Enable "Always On" feature

### **Benefits:**
- ✅ True 24/7 uptime
- ✅ No cold starts
- ✅ Professional reliability
- ✅ Client-ready anytime

---

## **Option 2: Free Keep-Alive (Budget)**

### **Deploy Keep-Alive Service:**

#### **1. Create New Render Service:**
- Name: `keep-alive-service`
- Repository: Your portfolio repo
- Build Command: `pip install -r requirements_keepalive.txt && python keep_alive.py`
- Start Command: `python keep_alive.py`

#### **2. Run Keep-Alive:**
```bash
# Install dependencies
pip install -r requirements_keepalive.txt

# Run keep-alive (runs 24/7)
python keep_alive.py
```

#### **3. Alternative: External Services (Free)**
- **UptimeRobot**: Free 50 monitors, 5-minute checks
- **Better Uptime**: Free 10 monitors, 1-minute checks
- **Pingdom**: Free basic monitoring

### **Setup UptimeRobot:**
1. Sign up at [uptimerobot.com](https://uptimerobot.com)
2. Add HTTP Monitor:
   - Monitor Type: HTTP(s)
   - URL: `https://price-tracker-frontend-cm6t.onrender.com`
   - Monitoring Interval: 5 minutes
3. Add second monitor for stock service
4. Enable alerts

---

## **💡 Recommended Setup:**

### **Professional Choice (Option 1):**
- **Cost**: $14/month ($7 × 2 services)
- **Reliability**: 99.9% uptime
- **Client Experience**: Instant response
- **Maintenance**: Zero

### **Budget Choice (Option 2):**
- **Cost**: Free
- **Reliability**: 95% uptime
- **Client Experience**: 30-second cold starts
- **Maintenance**: Minimal

---

## **🎯 Final Recommendation:**

**For freelance portfolio, go with Option 1 (Starter Plan)** because:
- Clients expect instant response
- Professional appearance matters
- $14/month is worth the reliability
- No maintenance headaches

**Your backends will run 24/7 without any intervention from you!**
