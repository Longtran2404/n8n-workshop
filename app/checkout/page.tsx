import { Section } from "../../components/ui/Section";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

export default function CheckoutPage() {
  return (
    <main>
      <Section className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Thanh toán</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-4">
            <h2 className="font-semibold">Chi tiết đơn hàng</h2>
            <ul className="mt-4 space-y-3 text-sm text-neutral-700">
              <li>Workflow A — $9</li>
              <li>Workflow B — $12</li>
            </ul>
            <div className="mt-4 font-bold">Tổng: $21</div>
          </Card>

          <Card className="p-4">
            <h2 className="font-semibold">Phương thức</h2>
            <p className="text-sm text-neutral-500 mt-2">Thanh toán an toàn qua Stripe.</p>
            <div className="mt-6"><Button variant="primary">Thanh toán</Button></div>
          </Card>
        </div>
      </Section>
    </main>
  );
}
