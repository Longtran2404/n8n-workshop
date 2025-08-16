import { Section } from "../components/ui/Section";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import WorkflowPreview from "../components/WorkflowPreview";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section với gradient background và animations */}
      <Section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.2),transparent),radial-gradient(circle_at_80%_80%,rgba(255,119,198,0.15),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            {/* Left Column - Hero Content */}
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 mb-6">
                Platform workflow chuyên nghiệp
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Khám phá & bán
                <br />
                <span className="text-gray-900">Workflow</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Nền tảng chia sẻ và bán workflow, khoá học và tài liệu chuyên nghiệp. 
                Trải nghiệm hiện đại với Google & Facebook login, thanh toán Stripe.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button variant="gradient" size="lg">
                  Khám phá ngay
                </Button>
                <Button variant="outline" size="lg">
                  Đăng workflow
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">2.5K+</div>
                  <div className="text-sm text-gray-600">Workflows</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">850+</div>
                  <div className="text-sm text-gray-600">Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">98%</div>
                  <div className="text-sm text-gray-600">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Right Column - Featured Cards */}
            <div className="relative">
              {/* Floating background elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-200 rounded-full opacity-20 animate-float" />
              <div className="absolute top-1/2 -left-8 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-float" style={{animationDelay: '1s'}} />
              
              <div className="space-y-6">
                <Card 
                  variant="featured" 
                  image="/placeholders/trending-1.svg" 
                  title="Design System Pro" 
                  subtitle="Complete design system với 200+ components cho teams" 
                  meta="4.9 ★ • 1.2k downloads"
                  animated={true}
                  className="transform rotate-2 hover:rotate-0"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-green-600">$49</span>
                    <Button size="sm" variant="primary">Mua ngay</Button>
                  </div>
                </Card>
                
                <Card 
                  variant="gradient" 
                  image="/placeholders/trending-2.svg" 
                  title="Onboarding Mastery" 
                  subtitle="Templates và strategies để tăng user retention 3x" 
                  meta="Hot • 940 downloads"
                  animated={true}
                  className="transform -rotate-1 hover:rotate-0 ml-8"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">$29</span>
                    <Button size="sm" variant="gradient">Download</Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Featured Workflows Section */}
      <Section variant="alt" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Workflows được yêu thích nhất
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Khám phá những workflow được cộng đồng đánh giá cao nhất, 
              từ design systems đến marketing automation.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card
                key={i}
                variant={i % 3 === 0 ? "featured" : "default"}
                image={`/placeholders/thumb-${(i % 3) + 1}.svg`}
                title={`Professional Workflow #${i + 1}`}
                subtitle="Detailed workflow description với step-by-step instructions và real-world examples."
                meta={i % 2 === 0 ? "Free" : `$${19 + i * 5}`}
                animated={true}
                className="card-hover"
              >
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-1">
                      <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white" />
                      <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-white" />
                      <div className="w-6 h-6 rounded-full bg-purple-500 border-2 border-white" />
                    </div>
                    <span className="text-xs text-gray-500">+{Math.floor(Math.random() * 100)} users</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant={i % 3 === 0 ? "gradient" : "primary"}
                  >
                    {i % 2 === 0 ? "Download" : "Preview"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Xem tất cả workflows
            </Button>
          </div>
        </div>
      </Section>

      {/* Workflow Showcase với Interactive Previews */}
      <Section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Workflow Templates Interactive
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Xem trước workflow hoạt động thực tế trước khi download. 
              Mỗi template đều được test và optimize cho performance.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <WorkflowPreview
              title="E-commerce Order Processing"
              nodes={[
                { id: 'trigger', label: 'New Order', type: 'trigger', x: 50, y: 50 },
                { id: 'validate', label: 'Validate Payment', type: 'condition', x: 200, y: 50 },
                { id: 'inventory', label: 'Check Stock', type: 'action', x: 350, y: 50 },
                { id: 'email', label: 'Send Confirmation', type: 'action', x: 200, y: 150 },
                { id: 'complete', label: 'Order Complete', type: 'output', x: 350, y: 150 }
              ]}
              connections={[
                { from: 'trigger', to: 'validate' },
                { from: 'validate', to: 'inventory' },
                { from: 'validate', to: 'email' },
                { from: 'inventory', to: 'complete' },
                { from: 'email', to: 'complete' }
              ]}
              className="hover:shadow-lg transition-shadow"
            />

            <WorkflowPreview
              title="Content Marketing Automation"
              nodes={[
                { id: 'schedule', label: 'Content Schedule', type: 'trigger', x: 50, y: 50 },
                { id: 'create', label: 'Generate Content', type: 'action', x: 200, y: 50 },
                { id: 'review', label: 'Quality Check', type: 'condition', x: 350, y: 50 },
                { id: 'social', label: 'Post to Social', type: 'action', x: 200, y: 150 },
                { id: 'analytics', label: 'Track Performance', type: 'output', x: 350, y: 150 }
              ]}
              connections={[
                { from: 'schedule', to: 'create' },
                { from: 'create', to: 'review' },
                { from: 'review', to: 'social' },
                { from: 'social', to: 'analytics' }
              ]}
              className="hover:shadow-lg transition-shadow"
            />

            <WorkflowPreview
              title="Customer Support Ticketing"
              nodes={[
                { id: 'ticket', label: 'New Ticket', type: 'trigger', x: 50, y: 50 },
                { id: 'classify', label: 'Auto Classify', type: 'action', x: 200, y: 50 },
                { id: 'priority', label: 'Set Priority', type: 'condition', x: 350, y: 50 },
                { id: 'assign', label: 'Assign Agent', type: 'action', x: 200, y: 150 },
                { id: 'notify', label: 'Notify Customer', type: 'output', x: 350, y: 150 }
              ]}
              connections={[
                { from: 'ticket', to: 'classify' },
                { from: 'classify', to: 'priority' },
                { from: 'priority', to: 'assign' },
                { from: 'assign', to: 'notify' }
              ]}
              className="hover:shadow-lg transition-shadow"
            />

            <WorkflowPreview
              title="Lead Generation & Nurturing"
              nodes={[
                { id: 'lead', label: 'New Lead', type: 'trigger', x: 50, y: 50 },
                { id: 'score', label: 'Lead Scoring', type: 'action', x: 200, y: 50 },
                { id: 'qualify', label: 'Qualification', type: 'condition', x: 350, y: 50 },
                { id: 'nurture', label: 'Email Campaign', type: 'action', x: 200, y: 150 },
                { id: 'convert', label: 'Sales Handoff', type: 'output', x: 350, y: 150 }
              ]}
              connections={[
                { from: 'lead', to: 'score' },
                { from: 'score', to: 'qualify' },
                { from: 'qualify', to: 'nurture' },
                { from: 'nurture', to: 'convert' }
              ]}
              className="hover:shadow-lg transition-shadow"
            />
          </div>

          <div className="text-center mt-12">
            <Button variant="gradient" size="lg">
              Explore All Templates
            </Button>
          </div>
        </div>
      </Section>

      {/* Testimonials Section */}
      <Section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Được tin tưởng bởi hàng nghìn designers
            </h2>
            <p className="text-xl text-gray-600">
              Cộng đồng chuyên nghiệp đánh giá cao chất lượng workflows
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                content: "Platform này đã thay đổi cách team chúng tôi làm việc. Workflows rất chi tiết và practical!",
                author: "Minh Nguyen",
                role: "Senior Designer tại VNG",
                avatar: "MN"
              },
              {
                content: "Quality workflows với documentation tuyệt vời. Đã save được hàng trăm giờ setup cho projects.",
                author: "Thu Pham", 
                role: "Design Lead tại Tiki",
                avatar: "TP"
              },
              {
                content: "Easy to use, professional quality. Đặc biệt thích feature Google/Facebook login rất smooth.",
                author: "Duc Le",
                role: "Product Designer tại Grab",
                avatar: "DL"
              }
            ].map((testimonial, i) => (
              <Card 
                key={i} 
                variant="subtle" 
                animated={true}
                className="text-center p-8 transform hover:scale-105"
                style={{animationDelay: `${i * 0.2}s`}}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                  {testimonial.avatar}
                </div>
                <blockquote className="text-gray-700 mb-6 italic">
                  "{testimonial.content}"
                </blockquote>
                <div className="font-semibold text-gray-900">{testimonial.author}</div>
                <div className="text-sm text-gray-500">{testimonial.role}</div>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Sẵn sàng nâng tầm workflow của bạn?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join cộng đồng 2.5K+ professionals và access library workflows chất lượng cao
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button variant="gradient" size="lg">
              Bắt đầu miễn phí
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900">
              Liên hệ tư vấn
            </Button>
          </div>
          
          {/* Facebook Like Button */}
          <div className="mt-8">
            <p className="text-gray-300 mb-4">Theo dõi chúng tôi trên Facebook:</p>
            <div className="flex justify-center">
              <div
                className="fb-like"
                data-href="http://localhost:3001/"
                data-width="450"
                data-layout="standard"
                data-action="like"
                data-size="large"
                data-share="true"
                data-show-faces="true">
              </div>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
