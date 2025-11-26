<?php

namespace App\Services;

use App\Models\Reminder;
use App\Models\ReminderCategory;

class RemindersService
{

    public function buildQuery(?string $search = null, string $sortBy = 'created_at', string $orderBy = 'desc', ?int $category = null)
    {
        $validColumns = ['status', 'sentiment', 'created_at', 'name', 'phone_number'];

        if (!in_array($sortBy, $validColumns)) {
            $sortBy = 'created_at';
        }

        $query = Reminder::with('customer', 'category')
            ->whereHas('customer', function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('phone_number', 'like', '%' . $search . '%');
            });

        if ($category !== null && $category !== 0) {
            $query->where('reminder_category_id', $category);
        }

        return $query->orderBy($sortBy, $orderBy);
    }



    //Posts
    public function storeReminder($data)
    {
        $reminder = new Reminder();
        $reminder->content = $data['content'];
        $reminder->description = $data['description'] ?? null;
        $reminder->observation = $data['observation'] ?? null;
        $reminder->customer_id = $data['customer_id'];
        $reminder->reminder_category_id = $data['category_id'];
        $reminder->save();

        return $reminder->id;
    }


    public function storeCategory($data)
    {

        $codes = [
            "#2A2251",
            "#2B265A",
            "#352668",
            "#3C2875",
            "#4A2D87",
            "#46277C",
            "#47267F",
            "#8B3B8E",
            "#782971",
            "#902F85",
            "#D698B2",
            "#E1A7C7",
            "#E1A7C7",
            "#E7E7E7",
            "#F6F6F6",
            "#4C6CAA",
            "#7398BF",
            "#D86E76",
            "#F7C5B1",
            "#000000"
        ];

        $selectedIndex = array_rand($codes);
        $selectedColor = $codes[$selectedIndex];

        $data['color_code'] = $selectedColor;

        $newCategory = ReminderCategory::create($data);
        return $newCategory->id;
    }
}
