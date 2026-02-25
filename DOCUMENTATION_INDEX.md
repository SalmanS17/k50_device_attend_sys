# 📚 Documentation Index & Navigation

## Quick Navigation by Task

Choose what you want to do:

---

## 🚀 Getting Started (New User)

**Start here if you're new:**

1. **Read First:** [STEP_BY_STEP_GUIDE.md](./STEP_BY_STEP_GUIDE.md)
   - Follow step-by-step instructions
   - Covers everything from installation to working system
   - ~30-45 minutes

2. **Quick Reference While Following:** [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
   - Commands at a glance
   - Common configurations
   - Troubleshooting table

3. **After Setup:** See "System Running" below

---

## 📖 Documentation by Topic

### Running & Testing

| Document                                         | Best For                         | Read Time |
| ------------------------------------------------ | -------------------------------- | --------- |
| [STEP_BY_STEP_GUIDE.md](./STEP_BY_STEP_GUIDE.md) | Step-by-step setup               | 30-45 min |
| [RUN_AND_TEST.md](./RUN_AND_TEST.md)             | Detailed reference while running | 20-30 min |
| [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)       | Quick command lookup             | 5 min     |
| [QUICK_START.md](./QUICK_START.md)               | 5-minute quick start             | 5 min     |

### Setup & Configuration

| Document                                 | Best For                      | Read Time |
| ---------------------------------------- | ----------------------------- | --------- |
| [K50_SETUP.md](./K50_SETUP.md)           | Detailed device configuration | 20-30 min |
| [K50_AUTH_GUIDE.md](./K50_AUTH_GUIDE.md) | Authentication issues         | 15-20 min |
| [SETUP_COMPLETE.md](./SETUP_COMPLETE.md) | Setup summary & next steps    | 10 min    |

### Backend Service

| Document                               | Best For                      | Read Time |
| -------------------------------------- | ----------------------------- | --------- |
| [server/README.md](./server/README.md) | Backend service documentation | 15-20 min |

### This Project

| Document                 | Best For         | Read Time |
| ------------------------ | ---------------- | --------- |
| [README.md](./README.md) | Project overview | 10 min    |

---

## ❓ Find Answer by Question

### "I'm starting from scratch, where do I begin?"

→ [STEP_BY_STEP_GUIDE.md](./STEP_BY_STEP_GUIDE.md)

### "How do I run the project?"

→ [RUN_AND_TEST.md](./RUN_AND_TEST.md#-step-4-run-the-project)

### "What commands do I need?"

→ [QUICK_REFERENCE.md](./QUICK_REFERENCE.md#️-run-the-project)

### "How do I find my K50 device IP?"

→ [STEP_BY_STEP_GUIDE.md](./STEP_BY_STEP_GUIDE.md#step-13-find-your-k50-device-ip-address)

### "Device requires a password, what do I do?"

→ [K50_AUTH_GUIDE.md](./K50_AUTH_GUIDE.md#scenario-1-device-requires-admin-credentials-)

### "Device has no API/web interface"

→ [K50_AUTH_GUIDE.md](./K50_AUTH_GUIDE.md#scenario-2-device-has-no-admin-access-available)

### "How do I test if everything works?"

→ [RUN_AND_TEST.md](./RUN_AND_TEST.md#-step-5-verify-everything-is-working)

### "I'm getting an error, how do I fix it?"

→ [RUN_AND_TEST.md](./RUN_AND_TEST.md#-troubleshooting-during-testing)

### "How do I deploy this?"

→ [README.md](./README.md#-deployment)

### "I want the full setup details"

→ [K50_SETUP.md](./K50_SETUP.md)

### "I just need the commands"

→ [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

---

## 📋 Checklist: Go From Zero to Working

### Phase 1: Before Starting

- [ ] Read [STEP_BY_STEP_GUIDE.md](./STEP_BY_STEP_GUIDE.md) - Phase 1
- [ ] Install Node.js if needed
- [ ] Find K50 device IP address
- [ ] Open project directory

### Phase 2: Installation

- [ ] Run [STEP_BY_STEP_GUIDE.md](./STEP_BY_STEP_GUIDE.md) - Phase 2
- [ ] `npm install`
- [ ] `npm run sync:install`

### Phase 3: Configuration

- [ ] Edit `.env` with device IP
- [ ] Save file

### Phase 4: Testing

- [ ] Run `npm run sync:test`
- [ ] Verify all tests pass

### Phase 5: Running

- [ ] Run [STEP_BY_STEP_GUIDE.md](./STEP_BY_STEP_GUIDE.md) - Phase 5
- [ ] Start frontend: `npm run dev`
- [ ] Start backend: `npm run sync:dev`
- [ ] Or both: `./start-dev.sh`

### Phase 6: Verification

- [ ] Open http://localhost:5173
- [ ] See dashboard load
- [ ] Check Supabase for data
- [ ] Check sync logs

### Phase 7: Success!

- [ ] System is working
- [ ] Move to "System Running" section

---

## 🎯 When System is Running

### Daily Tasks

- Keep frontend and backend running
- Monitor sync service logs
- Check dashboard for new records

### Maintenance

- Monitor for errors in logs
- Verify data accuracy
- Backup Supabase database

### Configuration Changes

- See [K50_SETUP.md](./K50_SETUP.md) for changing settings
- See [K50_AUTH_GUIDE.md](./K50_AUTH_GUIDE.md) for auth issues

### Troubleshooting

- Use [RUN_AND_TEST.md](./RUN_AND_TEST.md#-troubleshooting-during-testing)
- Run `npm run sync:test` to diagnose
- Check logs with `npm run sync:dev`

---

## 🔍 Finding Specific Information

### Searching Docs

**How to run:**

- Check [RUN_AND_TEST.md](./RUN_AND_TEST.md) → "Step 4: Run the Project"
- Or [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) → "Run the Project"

**Device configuration:**

- Check [K50_SETUP.md](./K50_SETUP.md) → "Step 1: Verify K50 Device"
- Or [STEP_BY_STEP_GUIDE.md](./STEP_BY_STEP_GUIDE.md) → "Phase 4"

**Troubleshooting:**

- Check [RUN_AND_TEST.md](./RUN_AND_TEST.md#-troubleshooting-during-testing)
- Or search docs for your error message

**Authentication:**

- [K50_AUTH_GUIDE.md](./K50_AUTH_GUIDE.md)

**Docker deployment:**

- [server/README.md](./server/README.md) → "Docker Deployment"

**Command reference:**

- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md#️-common-commands)

---

## 📊 Documentation Flow

```
New User
    ↓
[STEP_BY_STEP_GUIDE.md] ← Start here
    ↓
Installation phase?
├─ Yes → Follow steps 1-3
├─ Issue? → [K50_SETUP.md]
    ↓
Ready to run?
├─ Yes → Follow steps 4-5
├─ Issue? → [RUN_AND_TEST.md] (troubleshooting)
    ↓
System running?
├─ Yes → Great! Move to maintenance
├─ No → Check [RUN_AND_TEST.md] → Troubleshooting
    ↓
During development?
├─ Need commands? → [QUICK_REFERENCE.md]
├─ Need details? → [RUN_AND_TEST.md]
├─ Need help? → [K50_SETUP.md] or [K50_AUTH_GUIDE.md]
    ↓
Ready to deploy?
└─ Yes → [README.md] → Deployment section
```

---

## 🎓 Learning Path

### For Beginners (Never used before)

1. [STEP_BY_STEP_GUIDE.md](./STEP_BY_STEP_GUIDE.md) - Follow exactly
2. [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Keep handy
3. [RUN_AND_TEST.md](./RUN_AND_TEST.md) - Reference while running

### For Experienced Developers

1. [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Quick overview
2. [RUN_AND_TEST.md](./RUN_AND_TEST.md) - Detailed reference
3. [K50_SETUP.md](./K50_SETUP.md) - If configuration issues
4. [server/README.md](./server/README.md) - Backend details

### For DevOps/Deployment

1. [README.md](./README.md) → "Deployment"
2. [server/README.md](./server/README.md) → "Docker Deployment"
3. [K50_SETUP.md](./K50_SETUP.md) → "Running as Service"

---

## 📚 All Documentation Files

```
Project Root/
├── README.md                      ← Project overview
├── QUICK_START.md                ← 5-minute quick start
├── QUICK_REFERENCE.md            ← Command cheat sheet (this)
├── STEP_BY_STEP_GUIDE.md          ← Beginner-friendly walkthrough
├── RUN_AND_TEST.md                ← Detailed run & test guide
├── K50_SETUP.md                   ← Complete setup documentation
├── K50_AUTH_GUIDE.md              ← Authentication & access methods
├── SETUP_COMPLETE.md              ← Setup summary
├── DOCUMENTATION_INDEX.md         ← Navigation guide (this file)
├── server/README.md               ← Backend service docs
└── .env                           ← Configuration file
```

---

## ⚡ TL;DR (Too Long; Didn't Read)

**Just want to run it?**

```bash
npm install
npm run sync:install
npm run sync:test      # Verify it works
./start-dev.sh         # Run everything
# Open http://localhost:5173
```

**Having issues?**
Check [RUN_AND_TEST.md](./RUN_AND_TEST.md#-troubleshooting-during-testing)

**Need help?**

- Quick commands: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
- Auth issues: [K50_AUTH_GUIDE.md](./K50_AUTH_GUIDE.md)
- Device setup: [K50_SETUP.md](./K50_SETUP.md)

---

## 💡 Pro Tips

1. **Always start with** [STEP_BY_STEP_GUIDE.md](./STEP_BY_STEP_GUIDE.md) if you're new
2. **Keep** [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) open while developing
3. **Search** docs for keywords if stuck (Ctrl+F)
4. **Run** `npm run sync:test` before reporting issues
5. **Check logs** for error messages: `npm run sync:dev`

---

**Happy coding! 🚀**

If you get stuck, this navigation guide will help you find the right documentation!
