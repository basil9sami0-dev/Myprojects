import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function ProfileSetup() {
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    gender: "male" as "male" | "female",
    activityLevel: "moderate" as "sedentary" | "light" | "moderate" | "active" | "very_active",
    goal: "maintain" as "lose_weight" | "maintain" | "gain_weight",
  });

  const createProfile = useMutation(api.userProfile.createOrUpdateProfile);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.age || !formData.weight || !formData.height) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      await createProfile({
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        gender: formData.gender,
        activityLevel: formData.activityLevel,
        goal: formData.goal,
      });
      toast.success("تم إنشاء ملفك الشخصي بنجاح!");
    } catch (error) {
      toast.error("حدث خطأ في إنشاء الملف الشخصي");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-center mb-6">إعداد ملفك الشخصي</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">العمر</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="25"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">الوزن (كيلو)</label>
            <input
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="70"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">الطول (سم)</label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="175"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">الجنس</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="male"
                checked={formData.gender === "male"}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as "male" })}
                className="mr-2"
              />
              ذكر
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="female"
                checked={formData.gender === "female"}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as "female" })}
                className="mr-2"
              />
              أنثى
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">مستوى النشاط</label>
          <select
            value={formData.activityLevel}
            onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="sedentary">قليل الحركة (عمل مكتبي)</option>
            <option value="light">نشاط خفيف (تمرين 1-3 أيام/أسبوع)</option>
            <option value="moderate">نشاط متوسط (تمرين 3-5 أيام/أسبوع)</option>
            <option value="active">نشاط عالي (تمرين 6-7 أيام/أسبوع)</option>
            <option value="very_active">نشاط عالي جداً (تمرين مكثف يومياً)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">هدفك</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="lose_weight"
                checked={formData.goal === "lose_weight"}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value as any })}
                className="mr-2"
              />
              إنقاص الوزن
            </label>
            <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="maintain"
                checked={formData.goal === "maintain"}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value as any })}
                className="mr-2"
              />
              الحفاظ على الوزن
            </label>
            <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="gain_weight"
                checked={formData.goal === "gain_weight"}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value as any })}
                className="mr-2"
              />
              زيادة الوزن
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          حفظ الملف الشخصي
        </button>
      </form>
    </div>
  );
}
