const { createDecipheriv, createCipheriv, scryptSync } = await import("crypto");

export const encrypt = (plain_text) => {
	const algorithm = "aes-192-cbc";
	const password = process.env.password;
	const key = scryptSync(password, "salt", 24);
	const iv = Buffer.alloc(16, 0);

	const cipher = createCipheriv(algorithm, key, iv);
	let encrypted = cipher.update(plain_text, "utf8", "hex");
	encrypted += cipher.final("hex");
	return encrypted;
};

export const decrypt = (cipher_text) => {
	const algorithm = "aes-192-cbc";
	const password = process.env.password;
	const key = scryptSync(password, "salt", 24);
	const iv = Buffer.alloc(16, 0);

	const decipher = createDecipheriv(algorithm, key, iv);
	let decrypted = decipher.update(cipher_text, "hex", "utf8");
	decrypted += decipher.final("utf8");
	return decrypted;
};
