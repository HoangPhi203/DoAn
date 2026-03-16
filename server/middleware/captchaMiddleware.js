const crypto = require('crypto');

// In-memory store cho captcha (production nên dùng Redis)
const captchaStore = new Map();

// Tự động xóa captcha hết hạn mỗi 5 phút
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of captchaStore.entries()) {
        if (now > value.expires) {
            captchaStore.delete(key);
        }
    }
}, 5 * 60 * 1000);

// @desc    Tạo captcha mới
// @route   GET /api/auth/captcha
// @access  Public
exports.generateCaptcha = (req, res) => {
    const operators = ['+', '-', '×'];
    const operator = operators[Math.floor(Math.random() * operators.length)];

    let num1, num2, answer;

    switch (operator) {
        case '+':
            num1 = Math.floor(Math.random() * 50) + 1;
            num2 = Math.floor(Math.random() * 50) + 1;
            answer = num1 + num2;
            break;
        case '-':
            num1 = Math.floor(Math.random() * 50) + 10;
            num2 = Math.floor(Math.random() * num1);
            answer = num1 - num2;
            break;
        case '×':
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
            answer = num1 * num2;
            break;
    }

    const captchaId = crypto.randomBytes(16).toString('hex');
    const question = `${num1} ${operator} ${num2} = ?`;

    // Lưu vào store với thời hạn 5 phút
    captchaStore.set(captchaId, {
        answer,
        expires: Date.now() + 5 * 60 * 1000
    });

    res.status(200).json({
        success: true,
        data: {
            captchaId,
            question
        }
    });
};

// @desc    Middleware xác thực captcha
exports.verifyCaptcha = (req, res, next) => {
    const { captchaId, captchaAnswer } = req.body;

    // Nếu không gửi captcha, bỏ qua (cho phép backward compatibility)
    if (!captchaId && !captchaAnswer) {
        return next();
    }

    if (!captchaId || captchaAnswer === undefined || captchaAnswer === null) {
        return res.status(400).json({
            success: false,
            message: 'Vui lòng giải captcha'
        });
    }

    const stored = captchaStore.get(captchaId);

    if (!stored) {
        return res.status(400).json({
            success: false,
            message: 'Captcha không hợp lệ hoặc đã hết hạn. Vui lòng tải captcha mới.'
        });
    }

    // Xóa captcha sau khi sử dụng (one-time use)
    captchaStore.delete(captchaId);

    if (Date.now() > stored.expires) {
        return res.status(400).json({
            success: false,
            message: 'Captcha đã hết hạn. Vui lòng tải captcha mới.'
        });
    }

    if (parseInt(captchaAnswer) !== stored.answer) {
        return res.status(400).json({
            success: false,
            message: 'Đáp án captcha không đúng'
        });
    }

    next();
};
