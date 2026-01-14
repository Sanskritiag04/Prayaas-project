router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, age, address, password, confirmPassword } = req.body;

    // 1️⃣ Check password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // 2️⃣ Check existing volunteer
    const existingVolunteer = await Volunteer.findOne({ email });
    if (existingVolunteer) {
      return res.status(400).json({ message: "Volunteer already registered" });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Save volunteer (NO confirmPassword)
    const volunteer = new Volunteer({
      name,
      email,
      phone,
      age,
      address,
      password: hashedPassword
    });

    await volunteer.save();

    // 5️⃣ Generate JWT
    const token = jwt.sign(
      { id: volunteer._id, role: "volunteer" },
      "PRAYAAS_SECRET",
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Volunteer registered successfully",
      token
    });

  } catch (error) {
    console.error("REGISTER ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
});
