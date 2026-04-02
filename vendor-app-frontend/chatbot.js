// RuchiBazaar Chatbot
const chatbotFAQs = {
  vendor: [
    {
      question: "How do I place an order?",
      answer: "Go to the Marketplace, browse products, click 'Buy Now' on any product, enter the quantity you need, and confirm your order. You'll see the supplier's contact details to arrange pickup."
    },
    {
      question: "How do I contact a supplier?",
      answer: "When you place an order or view your order history, you'll see the supplier's name and phone number. You can call them directly to arrange pickup details."
    },
    {
      question: "Can I track my orders?",
      answer: "Yes! Go to 'My Orders' from the sidebar to see all your orders with their status (pending, delivered, or cancelled)."
    },
    {
      question: "How do I update my profile?",
      answer: "Click on 'My Profile' in the sidebar. Click the 'Edit' button, make your changes, and click 'Save' to update your information."
    },
    {
      question: "What payment methods are accepted?",
      answer: "Currently, payments are handled directly between vendors and suppliers during pickup. Contact your supplier to discuss payment options."
    },
    {
      question: "How do I cancel an order?",
      answer: "Contact the supplier directly using the phone number shown in your order details. They can update the order status to cancelled."
    }
  ],
  supplier: [
    {
      question: "How do I add a new product?",
      answer: "Click on 'Dashboard' and then 'Add New Product'. Fill in the product details including name, category, quantity, price, and upload an image. Click 'Add Product' to list it."
    },
    {
      question: "How do I manage incoming orders?",
      answer: "Go to 'Orders Received' from the sidebar. You'll see all orders with vendor contact details. You can mark orders as 'Delivered' or 'Cancelled'."
    },
    {
      question: "Can I edit my products?",
      answer: "Currently, you can view your products under 'My Products'. To update a product, you'll need to contact support or add a new listing."
    },
    {
      question: "How do I update my profile?",
      answer: "Click on 'My Profile' in the sidebar. Click 'Edit', update your business information, and click 'Save'."
    },
    {
      question: "How do vendors contact me?",
      answer: "When vendors place orders, they can see your phone number. They'll contact you directly to arrange pickup times and payment."
    },
    {
      question: "How do I track my earnings?",
      answer: "Your dashboard shows total earnings from all delivered orders. Go to 'Dashboard' to see your sales statistics."
    }
  ],
  general: [
    {
      question: "What is RuchiBazaar?",
      answer: "RuchiBazaar is a digital marketplace connecting street food vendors with vegetable and ingredient suppliers. Vendors can browse products and place orders, while suppliers can list their products and manage orders."
    },
    {
      question: "How do I sign up?",
      answer: "Click 'Signup' on the homepage, choose your role (Vendor or Supplier), fill in your details, and complete the onboarding process."
    },
    {
      question: "I forgot my password. What should I do?",
      answer: "Click 'Forgot Password' on the login page, enter your phone number and new password to reset it."
    },
    {
      question: "Is there a mobile app?",
      answer: "Currently, RuchiBazaar is a web application. You can access it from any browser on your phone, tablet, or computer."
    }
  ]
};

class RuchiBazaarChatbot {
  constructor() {
    this.isOpen = false;
    this.userRole = localStorage.getItem('userRole') || 'general';
    this.init();
  }

  init() {
    this.createChatbotHTML();
    this.attachEventListeners();
  }

  createChatbotHTML() {
    const chatbotHTML = `
      <!-- Chatbot Button -->
      <div id="chatbot-button" class="fixed bottom-6 right-6 z-50">
        <button class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      </div>

      <!-- Chatbot Window -->
      <div id="chatbot-window" class="fixed bottom-24 right-6 w-96 bg-white rounded-2xl shadow-2xl z-50 hidden flex-col" style="height: 500px; max-height: 80vh;">
        <!-- Header -->
        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <h3 class="font-semibold">RuchiBazaar Assistant</h3>
          </div>
          <button id="chatbot-close" class="hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Messages Area -->
        <div id="chatbot-messages" class="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          <div class="bg-white p-3 rounded-lg shadow-sm">
            <p class="text-sm text-gray-700">👋 Hi! I'm your RuchiBazaar assistant. How can I help you today?</p>
          </div>
        </div>

        <!-- FAQ Buttons -->
        <div id="chatbot-faqs" class="p-4 border-t bg-white overflow-y-auto" style="max-height: 200px;">
          <p class="text-xs text-gray-500 mb-2 font-semibold">Quick Questions:</p>
          <div id="faq-buttons" class="space-y-2"></div>
        </div>

        <!-- Input Area -->
        <div class="p-4 border-t bg-white rounded-b-2xl">
          <div class="flex gap-2">
            <input type="text" id="chatbot-input" placeholder="Type your question..." class="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm" />
            <button id="chatbot-send" class="bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    this.loadFAQs();
  }

  loadFAQs() {
    const faqContainer = document.getElementById('faq-buttons');
    const faqs = [...chatbotFAQs.general, ...chatbotFAQs[this.userRole] || []];

    faqContainer.innerHTML = faqs.map((faq, index) => `
      <button class="faq-btn w-full text-left px-3 py-2 bg-gray-100 hover:bg-indigo-50 rounded-lg text-xs text-gray-700 hover:text-indigo-700 transition" data-index="${index}">
        ${faq.question}
      </button>
    `).join('');

    document.querySelectorAll('.faq-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        const faq = faqs[index];
        this.addUserMessage(faq.question);
        setTimeout(() => this.addBotMessage(faq.answer), 500);
      });
    });
  }

  attachEventListeners() {
    document.getElementById('chatbot-button').addEventListener('click', () => this.toggleChatbot());
    document.getElementById('chatbot-close').addEventListener('click', () => this.toggleChatbot());
    document.getElementById('chatbot-send').addEventListener('click', () => this.handleUserInput());
    document.getElementById('chatbot-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleUserInput();
    });
  }

  toggleChatbot() {
    this.isOpen = !this.isOpen;
    const window = document.getElementById('chatbot-window');
    if (this.isOpen) {
      window.classList.remove('hidden');
      window.classList.add('flex');
    } else {
      window.classList.add('hidden');
      window.classList.remove('flex');
    }
  }

  handleUserInput() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    if (!message) return;

    this.addUserMessage(message);
    input.value = '';

    setTimeout(async () => {
      const response = await this.findAnswer(message);
      this.addBotMessage(response);
    }, 500);
  }

  async findAnswer(question) {
    const allFAQs = [...chatbotFAQs.general, ...chatbotFAQs[this.userRole] || []];
    const lowerQuestion = question.toLowerCase();

    // Greetings and casual responses
    if (lowerQuestion.match(/\b(hi|hello|hey|hii|hiii|helo|hola)\b/)) {
      return "Hello! 👋 How can I help you with RuchiBazaar today?";
    }
    if (lowerQuestion.match(/\b(bye|goodbye|see you|cya|later)\b/)) {
      return "Goodbye! Have a great day! Feel free to come back if you need any help. 😊";
    }
    if (lowerQuestion.match(/\b(thanks|thank you|thx|ty)\b/)) {
      return "You're welcome! Happy to help! 😊";
    }
    if (lowerQuestion.match(/^(ok|okay|cool|nice|great)$/)) {
      return "Great! Let me know if you need anything else! 👍";
    }

    // Check for data-related queries first
    const dataResponse = await this.handleDataQuery(lowerQuestion);
    if (dataResponse) return dataResponse;

    // Check for keyword matches
    for (const faq of allFAQs) {
      const faqLower = faq.question.toLowerCase();
      const keywords = faqLower.split(' ').filter(word => word.length > 3);
      
      // Check if question contains key words from FAQ
      const matchCount = keywords.filter(keyword => lowerQuestion.includes(keyword)).length;
      if (matchCount >= 2 || lowerQuestion.includes(faqLower)) {
        return faq.answer;
      }
    }

    // Keyword-based matching for common queries
    if (lowerQuestion.includes('add') && (lowerQuestion.includes('product') || lowerQuestion.includes('item'))) {
      return chatbotFAQs.supplier[0].answer;
    }
    if (lowerQuestion.includes('order') && (lowerQuestion.includes('place') || lowerQuestion.includes('buy'))) {
      return chatbotFAQs.vendor[0].answer;
    }
    if (lowerQuestion.includes('contact') && lowerQuestion.includes('supplier')) {
      return chatbotFAQs.vendor[1].answer;
    }
    if ((lowerQuestion.includes('nearby') || lowerQuestion.includes('near') || lowerQuestion.includes('local') || lowerQuestion.includes('suggest')) && lowerQuestion.includes('supplier')) {
      // This will be handled by handleDataQuery for vendors
      const dataResponse = await this.handleDataQuery(lowerQuestion);
      if (dataResponse) return dataResponse;
    }
    if (lowerQuestion.includes('track') || lowerQuestion.includes('view')) {
      if (this.userRole === 'vendor') {
        return chatbotFAQs.vendor[2].answer;
      } else {
        return chatbotFAQs.supplier[5].answer;
      }
    }
    if (lowerQuestion.includes('profile') || lowerQuestion.includes('update') || lowerQuestion.includes('edit')) {
      if (this.userRole === 'vendor') {
        return chatbotFAQs.vendor[3].answer;
      } else {
        return chatbotFAQs.supplier[3].answer;
      }
    }
    if (lowerQuestion.includes('payment') || lowerQuestion.includes('pay')) {
      return chatbotFAQs.vendor[4].answer;
    }
    if (lowerQuestion.includes('cancel')) {
      return chatbotFAQs.vendor[5].answer;
    }
    if (lowerQuestion.includes('manage') && lowerQuestion.includes('order')) {
      return chatbotFAQs.supplier[1].answer;
    }
    if (lowerQuestion.includes('earning') || lowerQuestion.includes('money') || lowerQuestion.includes('income')) {
      return chatbotFAQs.supplier[5].answer;
    }
    if (lowerQuestion.includes('signup') || lowerQuestion.includes('register') || lowerQuestion.includes('account')) {
      return chatbotFAQs.general[1].answer;
    }
    if (lowerQuestion.includes('password') || lowerQuestion.includes('forgot')) {
      return chatbotFAQs.general[2].answer;
    }

    return "I'm not sure about that. Please try selecting one of the quick questions below, or contact support for more help. You can also try rephrasing your question!";
  }

  async handleDataQuery(question) {
    const userId = localStorage.getItem('supplierId');
    if (!userId) return null;

    try {
      // Supplier queries
      if (this.userRole === 'supplier') {
        // Fetch orders first
        const res = await fetch(`http://localhost:5000/api/orders/supplier/${userId}`);
        const orders = await res.json();

        // Specific date queries FIRST
        const dateMatch = this.extractDate(question);
        if (dateMatch) {
          const targetDateStr = dateMatch.toDateString();
          const dateOrders = orders.filter(o => new Date(o.orderDate).toDateString() === targetDateStr);
          const dateDelivered = dateOrders.filter(o => o.status === 'delivered');
          const dateEarnings = dateDelivered.reduce((sum, o) => sum + o.totalAmount, 0);
          const datePending = dateOrders.filter(o => o.status === 'pending').length;
          
          const dateStr = dateMatch.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
          
          if (dateOrders.length === 0) {
            return `You didn't receive any orders on ${dateStr}. Keep your products updated to attract more vendors!`;
          }
          return `On ${dateStr}, you received ${dateOrders.length} order(s) and earned ₹${dateEarnings} from ${dateDelivered.length} delivered order(s). ${datePending > 0 ? `${datePending} order(s) are still pending.` : ''}`;
        }

        // Yesterday's orders
        if (question.includes('yesterday')) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toDateString();
          const yesterdayOrders = orders.filter(o => new Date(o.orderDate).toDateString() === yesterdayStr);
          const yesterdayDelivered = yesterdayOrders.filter(o => o.status === 'delivered');
          const yesterdayEarnings = yesterdayDelivered.reduce((sum, o) => sum + o.totalAmount, 0);
          const yesterdayPending = yesterdayOrders.filter(o => o.status === 'pending').length;
          
          if (yesterdayOrders.length === 0) {
            return `You didn't receive any orders yesterday. Keep promoting your products!`;
          }
          return `Yesterday you received ${yesterdayOrders.length} order(s) and earned ₹${yesterdayEarnings} from ${yesterdayDelivered.length} delivered order(s). ${yesterdayPending > 0 ? `${yesterdayPending} order(s) are still pending.` : ''}`;
        }

        // This week's orders
        if (question.includes('week') || question.includes('this week')) {
          const today = new Date();
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          const weekOrders = orders.filter(o => new Date(o.orderDate) >= weekAgo);
          const weekDelivered = weekOrders.filter(o => o.status === 'delivered');
          const weekEarnings = weekDelivered.reduce((sum, o) => sum + o.totalAmount, 0);
          const weekPending = weekOrders.filter(o => o.status === 'pending').length;
          
          return `This week you received ${weekOrders.length} order(s) and earned ₹${weekEarnings} from ${weekDelivered.length} delivered order(s). ${weekPending > 0 ? `${weekPending} order(s) are still pending.` : 'All weekly orders delivered!'}`;
        }

        // Products count
        if (question.includes('how many') && question.includes('product') && !question.includes('delivered')) {
          const productsRes = await fetch(`http://localhost:5000/api/products/supplier/${userId}`);
          const products = await productsRes.json();
          return `You currently have ${products.length} product(s) listed on RuchiBazaar. ${products.length === 0 ? 'Click "Add New Product" to start listing your products!' : 'You can view them in the "My Products" section.'}`;
        }

        // Sales/Orders queries
        const today = new Date().toDateString();

        // Sales today
        if ((question.includes('sales') || question.includes('sold')) && question.includes('today')) {
          const todayOrders = orders.filter(o => new Date(o.orderDate).toDateString() === today);
          const todayEarnings = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
          return `Today you have ${todayOrders.length} sale(s) with total earnings of ₹${todayEarnings}. ${todayOrders.length > 0 ? 'Great job! Keep it up!' : 'No sales yet today, but the day is not over!'}`;
        }

        // Orders today
        if ((question.includes('today') || question.includes('supplied')) && question.includes('order')) {
          const todayOrders = orders.filter(o => new Date(o.orderDate).toDateString() === today);
          return `You have received ${todayOrders.length} order(s) today. ${todayOrders.length > 0 ? 'Check "Orders Received" to manage them.' : 'Keep your products updated to attract more vendors!'}`;
        }

        // Delivered orders
        if (question.includes('delivered') || question.includes('completed')) {
          const delivered = orders.filter(o => o.status === 'delivered');
          const deliveredToday = delivered.filter(o => new Date(o.orderDate).toDateString() === today);
          
          if (question.includes('today')) {
            const todayEarnings = deliveredToday.reduce((sum, o) => sum + o.totalAmount, 0);
            return `You have delivered ${deliveredToday.length} order(s) today, earning ₹${todayEarnings}. ${deliveredToday.length > 0 ? 'Excellent work!' : 'Mark orders as delivered in "Orders Received".'}`;
          } else {
            const totalEarnings = delivered.reduce((sum, o) => sum + o.totalAmount, 0);
            return `You have successfully delivered ${delivered.length} order(s) in total, earning ₹${totalEarnings}. Keep up the great service!`;
          }
        }

        // Pending orders
        if (question.includes('pending') && question.includes('order')) {
          const pending = orders.filter(o => o.status === 'pending');
          return `You have ${pending.length} pending order(s) waiting for your action. Go to "Orders Received" to mark them as delivered or cancelled.`;
        }

        // Total earnings
        if (question.includes('earning') || question.includes('total') || question.includes('made') || question.includes('revenue')) {
          const dashRes = await fetch(`http://localhost:5000/api/supplier/dashboard/${userId}`);
          const data = await dashRes.json();
          return `Your total earnings are ₹${data.totalEarnings || 0} from ${data.ordersReceived || 0} order(s). You have ${data.pendingOrders || 0} pending order(s). Keep up the great work!`;
        }

        // Today's earnings
        if (question.includes('today') && (question.includes('earning') || question.includes('made') || question.includes('revenue'))) {
          const todayOrders = orders.filter(o => new Date(o.orderDate).toDateString() === today);
          const todayEarnings = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
          return `Today you have earned ₹${todayEarnings} from ${todayOrders.length} order(s). ${todayEarnings > 0 ? 'Great progress!' : 'Keep promoting your products!'}`;
        }
      }

      // Vendor queries
      if (this.userRole === 'vendor') {
        const res = await fetch(`http://localhost:5000/api/orders/vendor/${userId}`);
        const orders = await res.json();

        // Specific date queries FIRST (before general queries)
        const dateMatch = this.extractDate(question);
        if (dateMatch) {
          const targetDateStr = dateMatch.toDateString();
          const dateOrders = orders.filter(o => new Date(o.orderDate).toDateString() === targetDateStr);
          const dateDelivered = dateOrders.filter(o => o.status === 'delivered');
          const dateSpent = dateDelivered.reduce((sum, o) => sum + o.totalAmount, 0);
          const datePending = dateOrders.filter(o => o.status === 'pending').length;
          
          const dateStr = dateMatch.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
          
          if (dateOrders.length === 0) {
            return `You didn't place any orders on ${dateStr}. Visit the Marketplace to order fresh ingredients!`;
          }
          return `On ${dateStr}, you placed ${dateOrders.length} order(s) and spent ₹${dateSpent} on ${dateDelivered.length} delivered order(s). ${datePending > 0 ? `${datePending} order(s) are still pending.` : ''}`;
        }

        // Yesterday's orders
        if (question.includes('yesterday')) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toDateString();
          const yesterdayOrders = orders.filter(o => new Date(o.orderDate).toDateString() === yesterdayStr);
          const yesterdayDelivered = yesterdayOrders.filter(o => o.status === 'delivered');
          const yesterdaySpent = yesterdayDelivered.reduce((sum, o) => sum + o.totalAmount, 0);
          const yesterdayPending = yesterdayOrders.filter(o => o.status === 'pending').length;
          
          if (yesterdayOrders.length === 0) {
            return `You didn't place any orders yesterday. Visit the Marketplace to order fresh ingredients!`;
          }
          return `Yesterday you placed ${yesterdayOrders.length} order(s) and spent ₹${yesterdaySpent} on ${yesterdayDelivered.length} delivered order(s). ${yesterdayPending > 0 ? `${yesterdayPending} order(s) are still pending.` : ''}`;
        }

        // This week's orders
        if (question.includes('week') || question.includes('this week')) {
          const today = new Date();
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          const weekOrders = orders.filter(o => new Date(o.orderDate) >= weekAgo);
          const weekDelivered = weekOrders.filter(o => o.status === 'delivered');
          const weekSpent = weekDelivered.reduce((sum, o) => sum + o.totalAmount, 0);
          const weekPending = weekOrders.filter(o => o.status === 'pending').length;
          
          return `This week you placed ${weekOrders.length} order(s). You've spent ₹${weekSpent} on ${weekDelivered.length} delivered order(s). ${weekPending > 0 ? `${weekPending} order(s) are still pending.` : 'All weekly orders delivered!'}`;
        }

        // Today's orders
        if (question.includes('today')) {
          const today = new Date().toDateString();
          const todayOrders = orders.filter(o => new Date(o.orderDate).toDateString() === today);
          const todayDelivered = todayOrders.filter(o => o.status === 'delivered');
          const todaySpent = todayDelivered.reduce((sum, o) => sum + o.totalAmount, 0);
          const todayPending = todayOrders.filter(o => o.status === 'pending').length;
          
          if (todaySpent === 0 && todayOrders.length > 0) {
            return `Today you placed ${todayOrders.length} order(s), but they haven't been delivered yet. You have ${todayPending} pending order(s).`;
          }
          return `Today you have spent ₹${todaySpent} on ${todayDelivered.length} delivered order(s). ${todayPending > 0 ? `${todayPending} order(s) are still pending.` : ''}`;
        }

        // Orders count (general)
        if (question.includes('how many') && question.includes('order')) {
          return `You have placed ${orders.length} order(s) in total. ${orders.length === 0 ? 'Visit the Marketplace to place your first order!' : 'Check "My Orders" to view them all.'}`;
        }

        // Delivered orders
        if (question.includes('delivered') || question.includes('received')) {
          const delivered = orders.filter(o => o.status === 'delivered');
          return `You have received ${delivered.length} delivered order(s) out of ${orders.length} total orders. ${delivered.length < orders.length ? 'Some orders are still pending.' : 'All your orders have been delivered!'}`;
        }

        // Pending orders
        if (question.includes('pending')) {
          const pending = orders.filter(o => o.status === 'pending');
          return `You have ${pending.length} pending order(s). Contact the suppliers to arrange pickup.`;
        }

        // Total spent (only delivered orders)
        if (question.includes('spent') || question.includes('total') || question.includes('cost')) {
          const deliveredOrders = orders.filter(o => o.status === 'delivered');
          const total = deliveredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
          const pending = orders.filter(o => o.status === 'pending').length;
          
          if (total === 0 && orders.length > 0) {
            return `You haven't spent anything yet because your orders are still pending. You have ${pending} pending order(s) waiting for delivery.`;
          }
          return `You have spent ₹${total} on ${deliveredOrders.length} delivered order(s). ${pending > 0 ? `You have ${pending} pending order(s) not yet counted.` : 'All your orders have been delivered!'}`;
        }

        // Nearby suppliers
        if (question.includes('nearby') || question.includes('near me') || question.includes('near by') || question.includes('local') || question.includes('suggest')) {
          try {
            // Get vendor's location
            const vendorRes = await fetch(`http://localhost:5000/api/vendor/profile/${userId}`);
            const vendor = await vendorRes.json();
            
            console.log("Vendor location:", vendor.address);
            
            if (!vendor.address || (!vendor.address.village && !vendor.address.district)) {
              return "Please update your profile with your location (village/district) to find nearby suppliers. Go to 'My Profile' to add your address.";
            }

            // Get all products with supplier info
            const productsRes = await fetch(`http://localhost:5000/api/products`);
            const products = await productsRes.json();
            
            console.log("Total products found:", products.length);
            
            // Helper function to check if strings match (case-insensitive, partial match)
            const locationMatch = (loc1, loc2) => {
              if (!loc1 || !loc2) return false;
              const l1 = loc1.toLowerCase().trim();
              const l2 = loc2.toLowerCase().trim();
              return l1 === l2 || l1.includes(l2) || l2.includes(l1);
            };
            
            // Filter suppliers by location
            const nearbySuppliers = new Map();
            
            products.forEach(product => {
              const supplier = product.supplierId;
              console.log("Checking supplier:", supplier?.name, "Address:", supplier?.address);
              
              if (!supplier) return;
              
              let isNearby = false;
              let priority = 3; // 1=village, 2=street, 3=district
              
              // Check village match (highest priority)
              if (vendor.address.village && supplier.address?.village) {
                console.log(`Comparing villages: "${vendor.address.village}" vs "${supplier.address.village}"`);
                if (locationMatch(vendor.address.village, supplier.address.village)) {
                  isNearby = true;
                  priority = 1;
                  console.log("Village match found!");
                }
              }
              // Check street match (medium priority)
              if (!isNearby && vendor.address.street && supplier.address?.street) {
                if (locationMatch(vendor.address.street, supplier.address.street)) {
                  isNearby = true;
                  priority = 2;
                }
              }
              // Check district match (lowest priority)
              if (!isNearby && vendor.address.district && supplier.address?.district) {
                if (locationMatch(vendor.address.district, supplier.address.district)) {
                  isNearby = true;
                  priority = 3;
                }
              }

              if (isNearby) {
                if (!nearbySuppliers.has(supplier._id)) {
                  nearbySuppliers.set(supplier._id, {
                    name: supplier.businessName || supplier.name,
                    phone: supplier.phone,
                    location: `${supplier.address?.village || ''}, ${supplier.address?.district || ''}`.trim().replace(/^,\s*/, ''),
                    productCount: 1,
                    priority: priority
                  });
                } else {
                  nearbySuppliers.get(supplier._id).productCount++;
                }
              }
            });

            console.log("Nearby suppliers found:", nearbySuppliers.size);

            if (nearbySuppliers.size === 0) {
              return `No suppliers found near ${vendor.address.village || vendor.address.district} yet. You can browse all suppliers in the Marketplace!`;
            }

            // Sort by priority (village > street > district)
            const sortedSuppliers = Array.from(nearbySuppliers.entries()).sort((a, b) => a[1].priority - b[1].priority);

            let response = `Found ${sortedSuppliers.length} nearby supplier(s):\n\n`;
            let count = 0;
            
            for (const [id, info] of sortedSuppliers) {
              count++;
              response += `${count}. ${info.name}\n   📍 ${info.location}\n   📦 ${info.productCount} product(s)\n   📞 ${info.phone}\n\n`;
              if (count >= 5) break; // Show max 5 suppliers
            }
            
            response += `Visit the Marketplace to see their products!`;
            
            return response;
          } catch (error) {
            console.error('Error finding nearby suppliers:', error);
            return "Unable to find nearby suppliers. Please try again or visit the Marketplace to browse all suppliers.";
          }
        }
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }

    return null;
  }

  addUserMessage(message) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageHTML = `
      <div class="flex justify-end">
        <div class="bg-indigo-600 text-white p-3 rounded-lg max-w-xs shadow-sm">
          <p class="text-sm">${message}</p>
        </div>
      </div>
    `;
    messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  addBotMessage(message) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageHTML = `
      <div class="bg-white p-3 rounded-lg shadow-sm max-w-xs">
        <p class="text-sm text-gray-700">${message}</p>
      </div>
    `;
    messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  extractDate(question) {
    const lowerQuestion = question.toLowerCase();
    const today = new Date();
    
    // Days of week
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    for (let i = 0; i < daysOfWeek.length; i++) {
      if (lowerQuestion.includes(daysOfWeek[i])) {
        const targetDay = i;
        const currentDay = today.getDay();
        const diff = targetDay - currentDay;
        const daysAgo = diff <= 0 ? Math.abs(diff) : 7 - diff;
        const date = new Date(today);
        date.setDate(date.getDate() - daysAgo);
        return date;
      }
    }
    
    // Months
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 
                    'july', 'august', 'september', 'october', 'november', 'december'];
    
    // Match patterns like "january 15", "15 january", "15th january"
    for (let i = 0; i < months.length; i++) {
      if (lowerQuestion.includes(months[i])) {
        // Extract day number
        const dayMatch = lowerQuestion.match(/\b(\d{1,2})(st|nd|rd|th)?\b/);
        if (dayMatch) {
          const day = parseInt(dayMatch[1]);
          const year = today.getFullYear();
          const date = new Date(year, i, day);
          
          // If date is in future, use last year
          if (date > today) {
            date.setFullYear(year - 1);
          }
          return date;
        }
      }
    }
    
    // Match patterns like "on 15th", "on 20th" (current month)
    const dayOnlyMatch = lowerQuestion.match(/\bon\s+(\d{1,2})(st|nd|rd|th)?\b/);
    if (dayOnlyMatch) {
      const day = parseInt(dayOnlyMatch[1]);
      const date = new Date(today.getFullYear(), today.getMonth(), day);
      
      // If date is in future, use last month
      if (date > today) {
        date.setMonth(date.getMonth() - 1);
      }
      return date;
    }
    
    return null;
  }
}

// Initialize chatbot when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new RuchiBazaarChatbot());
} else {
  new RuchiBazaarChatbot();
}
