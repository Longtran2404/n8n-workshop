import { Section } from "../../components/ui/Section";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

export default function PricingPage() {
  return (
    <main>
      <Section className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Bảng giá thành viên & quyền lợi</h1>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold">Cá nhân</h3>
            <p className="text-sm text-neutral-600 mt-2">For freelancers and individual creators.</p>
            <div className="mt-4 text-3xl font-bold">$8<span className="text-base font-medium">/tháng</span></div>
            <div className="mt-6"><Button variant="primary">Bắt đầu</Button></div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold">Nhóm</h3>
            <p className="text-sm text-neutral-600 mt-2">Team plan with shared assets and permissions.</p>
            <div className="mt-4 text-3xl font-bold">$24<span className="text-base font-medium">/tháng</span></div>
            <div className="mt-6"><Button variant="primary">Bắt đầu</Button></div>
          </Card>
        </div>
      </Section>
    </main>
  );
}
