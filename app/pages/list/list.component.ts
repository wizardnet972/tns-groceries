import * as SocialShare from "nativescript-social-share";
import { Component, OnInit, ViewChild, ElementRef, NgZone } from "@angular/core";

import { GroceryListService } from "../../shared/grocery/grocery-list.service";
import { Grocery } from "../../shared/grocery/grocery";
import { TextField } from "ui/text-field";

@Component({
  selector: "list",
  templateUrl: "pages/list/list.html",
  styleUrls: ["pages/list/list-common.css", "pages/list/list.css"],
  providers: [GroceryListService]
})
export class ListComponent implements OnInit {

  groceryList: Array<Grocery> = [];
  grocery = "";
  @ViewChild("groceryTextField") groceryTextField: ElementRef;
  isLoading = false;
  listLoaded = false;

  constructor(
    private groceryListService: GroceryListService,
    private zone: NgZone) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.groceryListService.load()
      .subscribe(loadedGroceries => {
        loadedGroceries.forEach((groceryObject) => {
          this.groceryList.unshift(groceryObject);
        });
        this.isLoading = false;
        this.listLoaded = true;
      });
  }

  add() {
    if (this.grocery.trim() === "") {
      alert("Enter a grocery item");
      return;
    }

    // Dismiss the keyboard
    let textField = <TextField>this.groceryTextField.nativeElement;
    textField.dismissSoftInput();

    this.groceryListService.add(this.grocery)
      .subscribe(
      groceryObject => {
        this.groceryList.unshift(groceryObject);
        this.grocery = "";
      },
      () => {
        alert({
          message: "An error occurred while adding an item to your list.",
          okButtonText: "OK"
        });
        this.grocery = "";
      }
      )
  }

  delete(grocery: Grocery) {
    this.groceryListService.delete(grocery.id)
      .subscribe(() => {
        this.zone.run(() => {
          let index = this.groceryList.indexOf(grocery);
          this.groceryList.splice(index, 1);
        });
      });
  }

  share() {
    let listString = this.groceryList
      .map(grocery => grocery.name)
      .join(", ")
      .trim();
    SocialShare.shareText(listString);
  }
}