import { useState, useRef, useEffect } from 'react'
import { Input, Button, Typography, Badge } from 'antd'
import {
    RobotOutlined,
    CloseOutlined,
    SendOutlined,
    MinusOutlined,
} from '@ant-design/icons'

const { Text } = Typography

// Knowledge base for the laptop repair shop
const KNOWLEDGE_BASE = {
    greetings: {
        patterns: ['xin chào', 'hello', 'hi', 'hey', 'chào', 'alo', 'có ai không', 'hỏi'],
        response: 'Xin chào! 👋 Tôi là trợ lý AI của LaptopCare. Tôi có thể giúp bạn về:\n\n• Dịch vụ sửa chữa laptop\n• Báo giá dịch vụ\n• Đặt lịch hẹn\n• Tra cứu đơn hàng\n• Thông tin linh kiện\n\nBạn cần hỗ trợ gì ạ?',
    },
    pricing: {
        patterns: ['giá', 'bao nhiêu', 'chi phí', 'phí', 'báo giá', 'price', 'tiền'],
        response: '💰 Bảng giá dịch vụ tham khảo:\n\n• Thay màn hình: từ 1.500.000đ\n• Thay pin laptop: từ 800.000đ\n• Sửa bàn phím: từ 300.000đ\n• Vệ sinh, bảo dưỡng: từ 200.000đ\n• Nâng cấp RAM/SSD: từ 500.000đ\n• Sửa lỗi phần mềm: từ 150.000đ\n\n📌 Giá chính xác tùy thuộc vào model máy. Bạn có thể cho tôi biết model laptop để báo giá chi tiết hơn!',
    },
    screen: {
        patterns: ['màn hình', 'screen', 'display', 'vỡ màn', 'sọc màn', 'tối màn'],
        response: '🖥️ Dịch vụ thay màn hình laptop:\n\n• Thay màn hình chính hãng\n• Giá từ 1.500.000đ - 5.000.000đ tùy model\n• Bảo hành 6-12 tháng\n• Thời gian: 1-2 giờ\n\nBạn cho tôi biết model laptop để báo giá chính xác nhé!',
    },
    battery: {
        patterns: ['pin', 'battery', 'chai pin', 'hết pin', 'sạc không vào'],
        response: '🔋 Dịch vụ thay pin laptop:\n\n• Pin chính hãng & pin thay thế chất lượng\n• Giá từ 800.000đ - 2.000.000đ\n• Bảo hành 6-12 tháng\n• Thay ngay trong 30 phút\n\nBạn dùng laptop hãng gì và model nào ạ?',
    },
    keyboard: {
        patterns: ['bàn phím', 'keyboard', 'phím', 'gõ không được', 'liệt phím'],
        response: '⌨️ Dịch vụ sửa/thay bàn phím:\n\n• Sửa phím đơn lẻ\n• Thay bàn phím mới\n• Giá từ 300.000đ - 1.500.000đ\n• Bảo hành 3-6 tháng\n\nBạn mô tả tình trạng bàn phím để tôi tư vấn nhé!',
    },
    booking: {
        patterns: ['đặt lịch', 'hẹn', 'lịch hẹn', 'book', 'appointment', 'đặt hẹn', 'muốn sửa'],
        response: '📅 Để đặt lịch hẹn, bạn có thể:\n\n1. Truy cập trang "Đặt lịch" trên menu\n2. Hoặc gọi hotline: 0383634255\n\n⏰ Giờ làm việc:\n• Thứ 2 - Thứ 7: 8:00 - 20:00\n• Chủ nhật: 9:00 - 17:00\n\nBạn muốn đặt lịch vào thời gian nào ạ?',
    },
    lookup: {
        patterns: ['tra cứu', 'đơn hàng', 'tình trạng', 'tiến độ', 'kiểm tra', 'order', 'status'],
        response: '🔍 Để tra cứu đơn hàng:\n\n1. Truy cập trang "Tra cứu" trên website\n2. Nhập mã đơn hàng hoặc số điện thoại\n3. Xem tình trạng sửa chữa real-time\n\nBạn có mã đơn hàng không ạ? Tôi có thể hướng dẫn thêm!',
    },
    warranty: {
        patterns: ['bảo hành', 'warranty', 'guarantee'],
        response: '🛡️ Chính sách bảo hành:\n\n• Linh kiện thay thế: 3-12 tháng\n• Dịch vụ sửa chữa: 1-6 tháng\n• Phần mềm: 1 tháng\n\n✅ Cam kết:\n• Bảo hành đổi mới nếu lỗi do linh kiện\n• Không tính phí nếu lỗi tái phát\n• Hỗ trợ tận nơi cho khách VIP',
    },
    contact: {
        patterns: ['liên hệ', 'contact', 'địa chỉ', 'ở đâu', 'cửa hàng', 'phone', 'điện thoại', 'gọi'],
        response: '📞 Thông tin liên hệ:\n\n• Hotline: 0383634255\n• Email: support@laptopcare.vn\n• Địa chỉ: 123 Nguyễn Văn Linh, Long Biên, TP.Hà Nội\n\n⏰ Giờ làm việc:\n• Thứ 2 - Thứ 7: 8:00 - 20:00\n• Chủ nhật: 9:00 - 17:00',
    },
    software: {
        patterns: ['phần mềm', 'software', 'cài win', 'virus', 'chậm', 'lag', 'đơ', 'treo máy', 'windows'],
        response: '💻 Dịch vụ phần mềm:\n\n• Cài đặt Windows/macOS: từ 150.000đ\n• Diệt virus, malware: từ 100.000đ\n• Tối ưu hệ thống: từ 150.000đ\n• Cài đặt phần mềm chuyên dụng: từ 50.000đ\n• Recovery dữ liệu: từ 300.000đ\n\nMáy bạn đang gặp tình trạng gì ạ?',
    },
    upgrade: {
        patterns: ['nâng cấp', 'upgrade', 'ram', 'ssd', 'ổ cứng', 'bộ nhớ'],
        response: '🚀 Dịch vụ nâng cấp:\n\n• Nâng cấp RAM: từ 500.000đ\n• Thay SSD: từ 800.000đ\n• Nâng cấp combo RAM + SSD: ưu đãi 10%\n\n✅ Tư vấn cấu hình phù hợp nhu cầu\n✅ Linh kiện chính hãng, bảo hành dài\n\nBạn dùng laptop model gì? Tôi sẽ tư vấn nâng cấp phù hợp!',
    },
    thanks: {
        patterns: ['cảm ơn', 'thanks', 'thank', 'ok', 'được rồi', 'cám ơn'],
        response: 'Cảm ơn bạn! 😊 Nếu cần hỗ trợ thêm, đừng ngần ngại nhắn tin nhé. Chúc bạn một ngày tốt lành! 🌟',
    },
}

const DEFAULT_RESPONSE = 'Cảm ơn bạn đã liên hệ! 🤔 Tôi chưa hiểu rõ câu hỏi của bạn. Bạn có thể hỏi về:\n\n• Giá dịch vụ sửa chữa\n• Đặt lịch hẹn\n• Tra cứu đơn hàng\n• Bảo hành\n• Nâng cấp laptop\n\nHoặc gọi hotline 0383634255 để được hỗ trợ trực tiếp!'

function getAIResponse(message) {
    const lowerMsg = message.toLowerCase().trim()

    for (const category of Object.values(KNOWLEDGE_BASE)) {
        for (const pattern of category.patterns) {
            if (lowerMsg.includes(pattern)) {
                return category.response
            }
        }
    }

    return DEFAULT_RESPONSE
}

const AIChatBot = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            text: 'Xin chào! 👋 Tôi là trợ lý AI của LaptopCare. Tôi có thể giúp bạn tư vấn dịch vụ sửa chữa laptop, báo giá, đặt lịch hẹn và nhiều hơn nữa. Hãy hỏi tôi bất cứ điều gì!',
            time: new Date(),
        },
    ])
    const [inputValue, setInputValue] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [unreadCount, setUnreadCount] = useState(1)
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping])

    useEffect(() => {
        if (isOpen) {
            setUnreadCount(0)
            setTimeout(() => inputRef.current?.focus(), 300)
        }
    }, [isOpen])

    const handleSend = () => {
        const text = inputValue.trim()
        if (!text) return

        const userMsg = {
            id: Date.now(),
            type: 'user',
            text,
            time: new Date(),
        }
        setMessages(prev => [...prev, userMsg])
        setInputValue('')
        setIsTyping(true)

        // Simulate AI thinking delay
        const delay = 600 + Math.random() * 800
        setTimeout(() => {
            const response = getAIResponse(text)
            const botMsg = {
                id: Date.now() + 1,
                type: 'bot',
                text: response,
                time: new Date(),
            }
            setMessages(prev => [...prev, botMsg])
            setIsTyping(false)
            if (!isOpen) {
                setUnreadCount(prev => prev + 1)
            }
        }, delay)
    }

    const formatTime = (date) => {
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }

    const quickQuestions = [
        'Báo giá dịch vụ',
        'Đặt lịch hẹn',
        'Bảo hành',
        'Liên hệ',
    ]

    const handleQuickQuestion = (q) => {
        setInputValue(q)
        setTimeout(() => {
            const userMsg = {
                id: Date.now(),
                type: 'user',
                text: q,
                time: new Date(),
            }
            setMessages(prev => [...prev, userMsg])
            setIsTyping(true)

            const delay = 600 + Math.random() * 800
            setTimeout(() => {
                const response = getAIResponse(q)
                const botMsg = {
                    id: Date.now() + 1,
                    type: 'bot',
                    text: response,
                    time: new Date(),
                }
                setMessages(prev => [...prev, botMsg])
                setIsTyping(false)
            }, delay)

            setInputValue('')
        }, 100)
    }

    return (
        <>
            {/* Chat Window */}
            {isOpen && (
                <div
                    className="fixed bottom-24 right-6 z-50 animate-fade-in-up"
                    style={{
                        width: 380,
                        maxWidth: 'calc(100vw - 32px)',
                        height: 520,
                        maxHeight: 'calc(100vh - 140px)',
                        borderRadius: 16,
                        overflow: 'hidden',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        background: '#fff',
                    }}
                >
                    {/* Chat Header */}
                    <div
                        className="flex items-center justify-between px-4 py-3 shrink-0"
                        style={{
                            background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <RobotOutlined className="text-white text-xl" />
                            </div>
                            <div>
                                <div className="text-white font-semibold text-base">LaptopCare AI</div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                                    <span className="text-white/80 text-xs">Đang hoạt động</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                type="text"
                                size="small"
                                icon={<MinusOutlined className="text-white" />}
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-white/10"
                            />
                            <Button
                                type="text"
                                size="small"
                                icon={<CloseOutlined className="text-white" />}
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-white/10"
                            />
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div
                        className="flex-1 overflow-y-auto px-4 py-3"
                        style={{ background: '#f8f7ff' }}
                    >
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex mb-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.type === 'bot' && (
                                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0 mr-2 mt-1">
                                        <RobotOutlined className="text-white text-sm" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl ${msg.type === 'user'
                                        ? 'bg-primary-600 text-white rounded-br-md'
                                        : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100'
                                        }`}
                                    style={{ whiteSpace: 'pre-line', fontSize: 14, lineHeight: 1.5 }}
                                >
                                    {msg.text}
                                    <div
                                        className={`text-[10px] mt-1 ${msg.type === 'user' ? 'text-white/60' : 'text-gray-400'
                                            }`}
                                        style={{ textAlign: msg.type === 'user' ? 'right' : 'left' }}
                                    >
                                        {formatTime(msg.time)}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex justify-start mb-3">
                                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0 mr-2 mt-1">
                                    <RobotOutlined className="text-white text-sm" />
                                </div>
                                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
                                    <div className="flex gap-1.5 items-center">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Quick Questions (show only when few messages) */}
                        {messages.length <= 1 && !isTyping && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {quickQuestions.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleQuickQuestion(q)}
                                        className="px-3 py-1.5 bg-white border border-primary-200 text-primary-600 rounded-full text-xs font-medium hover:bg-primary-50 transition-colors cursor-pointer"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="px-3 py-3 border-t border-gray-100 bg-white shrink-0">
                        <div className="flex gap-2">
                            <Input
                                ref={inputRef}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onPressEnter={handleSend}
                                placeholder="Nhập tin nhắn..."
                                className="rounded-full"
                                size="large"
                                disabled={isTyping}
                            />
                            <Button
                                type="primary"
                                shape="circle"
                                size="large"
                                icon={<SendOutlined />}
                                onClick={handleSend}
                                disabled={!inputValue.trim() || isTyping}
                                className="shrink-0"
                            />
                        </div>
                        <div className="text-center mt-2">
                            <Text className="text-[10px] text-gray-400">
                                Powered by LaptopCare AI • Trả lời tự động 24/7
                            </Text>
                        </div>
                    </div>
                </div>
            )}

            {/* Chat Toggle Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <Badge count={unreadCount} offset={[-5, 5]}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-pointer border-none transition-all hover:scale-110"
                        style={{
                            background: isOpen
                                ? '#6b7280'
                                : 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                            boxShadow: isOpen
                                ? '0 4px 15px rgba(0,0,0,0.2)'
                                : '0 4px 20px rgba(124, 58, 237, 0.4)',
                        }}
                    >
                        {isOpen ? (
                            <CloseOutlined className="text-white text-xl" />
                        ) : (
                            <RobotOutlined className="text-white text-2xl" />
                        )}
                    </button>
                </Badge>
            </div>
        </>
    )
}

export default AIChatBot
