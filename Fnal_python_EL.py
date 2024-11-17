import tkinter as tk
from tkinter import ttk, messagebox
import pandas as pd

class CarPoolSystem:
    def __init__(self, excel_file):
        self.data = pd.read_excel(excel_file)

    def find_carpool_match(self, pickup, drop):
        matches = self.data[(self.data['pickup_location'] == pickup) & (self.data['dropoff_location'] == drop)]
        return matches

    def show_carpool_details(self, serial_number):
        carpool = self.data[self.data['sl_no'] == serial_number]
        if not carpool.empty:
            return carpool
        else:
            return None

class CarPoolApp:
    def __init__(self, master, car_pool_system):
        self.master = master
        self.master.title("CarPool System")


        self.master.configure(bg='#F0F0F0')

        self.car_pool_system = car_pool_system


        style = ttk.Style()
        style.theme_use("clam")


        style.configure("TButton", foreground="white", background="#4CAF50", font=('Arial', 12))


        style.configure("TEntry", fieldbackground="white", font=('Arial', 12))


        notebook = ttk.Notebook(master)
        notebook.pack(fill='both', expand=True)


        search_tab = ttk.Frame(notebook)
        notebook.add(search_tab, text='Search')

        search_frame = ttk.Frame(search_tab, padding="10")
        search_frame.pack()


        search_frame.configure()

        self.label_pickup = ttk.Label(search_frame, text="Enter pickup location:", font=('Arial', 12), background='#F0F0F0')
        self.label_pickup.grid(row=0, column=0, pady=5, padx=5, sticky='w')

        self.entry_pickup = ttk.Entry(search_frame, style="TEntry")
        self.entry_pickup.grid(row=0, column=1, pady=5, padx=5)

        self.label_drop = ttk.Label(search_frame, text="Enter drop location:", font=('Arial', 12), background='#F0F0F0')
        self.label_drop.grid(row=1, column=0, pady=5, padx=5, sticky='w')

        self.entry_drop = ttk.Entry(search_frame, style="TEntry")
        self.entry_drop.grid(row=1, column=1, pady=5, padx=5)

        self.button_search = ttk.Button(search_frame, text="Search Carpool", command=self.search_carpool)
        self.button_search.grid(row=2, column=0, columnspan=2, pady=10)


        results_tab = ttk.Frame(notebook)
        notebook.add(results_tab, text='Results')

        table_frame = ttk.Frame(results_tab)
        table_frame.pack(pady=10)


        table_frame.configure()
        self.tree_matches = ttk.Treeview(table_frame,
                                         columns=("sl_no", "pickup_location", "dropoff_location", "passenger_count"),
                                         show="headings")
        self.tree_matches.heading("sl_no", text="Serial Number")
        self.tree_matches.heading("pickup_location", text="Pickup Location")
        self.tree_matches.heading("dropoff_location", text="Drop Location")
        self.tree_matches.heading("passenger_count", text="Passenger Count")
        self.tree_matches.pack()

        self.tree_matches.column("sl_no", width=100)
        self.tree_matches.column("pickup_location", width=150)
        self.tree_matches.column("dropoff_location", width=150)
        self.tree_matches.column("passenger_count", width=100)

        self.tree_matches.bind("<Double-1>", self.show_details)

    def search_carpool(self):
        pickup = self.entry_pickup.get().title()
        drop = self.entry_drop.get().title()

        matches = self.car_pool_system.find_carpool_match(pickup, drop)


        for row in self.tree_matches.get_children():
            self.tree_matches.delete(row)

        if not matches.empty:
            for index, row in matches.iterrows():
                self.tree_matches.insert("", "end", values=(
                    row['sl_no'], row['pickup_location'], row['dropoff_location'], row['passenger_count']))
        else:
            messagebox.showinfo("No Matches", "No carpool matches found.")

    def show_details(self, event):
        selected_item = self.tree_matches.selection()[0]
        serial_number = int(self.tree_matches.item(selected_item, "values")[0])

        carpool_details = self.car_pool_system.show_carpool_details(serial_number)

        if carpool_details is not None:
            details_window = tk.Toplevel(self.master)
            details_window.title(f"Carpool Details - Serial Number {serial_number}")

            details_frame = ttk.Frame(details_window, padding="10")
            details_frame.pack()


            details_table = ttk.Treeview(details_frame, columns=("Attribute", "Value"), show="headings", height=16)
            details_table.heading("Attribute", text="Attribute")
            details_table.heading("Value", text="Value")
            details_table.pack()
            details_table.column("Attribute", width=200)
            details_table.column("Value", width=200)

            for _, row in carpool_details.iterrows():
                for col, value in row.items():
                    details_table.insert("", "end", values=(col, value))


        else:
            messagebox.showinfo("Invalid Serial Number", "Invalid serial number. Carpool not found.")


excel_file = r'C:\RVCE(2023-27)\main_dataset.xlsx'
car_pool_system = CarPoolSystem(excel_file)

root = tk.Tk()
app = CarPoolApp(root, car_pool_system)
root.mainloop()
