import { Section } from "../../components/ui/Section";
import { Card } from "../../components/ui/Card";
import { AvatarText } from "../../components/ui/AvatarText";
import { Button } from "../../components/ui/Button";

export default function AccountPage() {
  return (
    <main>
      <Section className="max-w-3xl mx-auto">
        <div className="flex items-start gap-6">
          <AvatarText name="Người dùng" />
          <div>
            <h1 className="text-2xl font-semibold">Người dùng</h1>
            <p className="text-sm text-neutral-600">Email: user@example.com</p>
          </div>
        </div>

        <section className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Uploads của bạn</h2>
          <div className="grid gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">Workflow đã đăng #{i + 1}</div>
                  <div className="text-sm text-neutral-500">Đã bán: {i * 3} lần</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm">Sửa</Button>
                  <Button variant="outline" size="sm">Xóa</Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </Section>
    </main>
  );
}
