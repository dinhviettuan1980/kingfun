var Card = cc.Class.extend({
    _id: null,
    _rank: null, // 0,1,2,...,9
    _suit: null, // do, co, tep, bich
    _name: null, // hai_do, ba_bich,....

    ctor: function(id, rank, suit, name) {
        this._id = id;
        this._rank = rank;
        this._suit = suit;
        this._name = name;
    },

    toString: function() {
        console.log(this._id + " " + this._rank + " " + this._suit + " " + this._name);
    },
});

var Player = cc.Class.extend({
    id: null,
    name: null,
    cards: null,
    total_points: null,
    highest_card_value: null,
    wallet_money: null,
    isEnable: true,

    ctor: function(id, name, cards, isEnable) {
        this.id = id;
        this.name = name;
        this.cards = cards;
        this.total_points = 0;
        this.highest_card_value = 100;
        this.wallet_money = 4000 + Math.floor(Math.random() * 3000);

        if (!isEnable) isEnable = false;
        this.isEnable = isEnable;

        if (cc.sys.localStorage.getItem(name + "_wallet")) {
            this.wallet_money = Math.round(cc.sys.localStorage.getItem(name + "_wallet"));
        }
    },

    addCard: function(c) {
        this.cards.push(c);
    },

    clear: function() {
        this.cards = [];
        this.total_points = 0;
        this.highest_card_value = 100;
    },

    calculate: function() {
        for (var i = 0; i < this.cards.length; i++) {
            this.total_points += this.cards[i]._rank;
            if (this.cards[i]._id < this.highest_card_value) {
                this.highest_card_value = Math.round(this.cards[i]._id);
            }
        }

        this.total_points = this.total_points % 10;
        if (this.total_points == 0) {
            this.total_points = 10;
        }

        if (!this.isEnable) this.total_points = 0;

        console.log(this.toString());
    },

    addBudget: function(amount) {
        this.wallet_money += amount;
    },

    minusBudget: function(amount) {
        if (this.isEnable)
            this.wallet_money -= amount;
    },

    toString: function() {
        console.log("tuandv: " + this.id + " " + this.name + " " + this.cards[0]._rank + " " + this.cards[1]._rank + " " + this.cards[2]._rank);
        console.log("tuandv: " + this.id + " " + this.name + " " + this.total_points + " " + this.highest_card_value);
    },
});

function initCards(cardList) {
    cardList.push(new Card(0, 1, 3, "mot_do"));
    cardList.push(new Card(8, 2, 3, "hai_do"));
    cardList.push(new Card(7, 3, 3, "ba_do"));
    cardList.push(new Card(6, 4, 3, "bon_do"));
    cardList.push(new Card(5, 5, 3, "nam_do"));
    cardList.push(new Card(4, 6, 3, "sau_do"));
    cardList.push(new Card(3, 7, 3, "bay_do"));
    cardList.push(new Card(2, 8, 3, "tam_do"));
    cardList.push(new Card(1, 9, 3, "chin_do"));

    cardList.push(new Card(9, 1, 2, "mot_co"));
    cardList.push(new Card(17, 2, 2, "hai_co"));
    cardList.push(new Card(16, 3, 2, "ba_co"));
    cardList.push(new Card(15, 4, 2, "bon_co"));
    cardList.push(new Card(14, 5, 2, "nam_co"));
    cardList.push(new Card(13, 6, 2, "sau_co"));
    cardList.push(new Card(12, 7, 2, "bay_co"));
    cardList.push(new Card(11, 8, 2, "tam_co"));
    cardList.push(new Card(10, 9, 2, "chin_co"));

    cardList.push(new Card(18, 1, 1, "mot_tep"));
    cardList.push(new Card(26, 2, 1, "hai_tep"));
    cardList.push(new Card(25, 3, 1, "ba_tep"));
    cardList.push(new Card(24, 4, 1, "bon_tep"));
    cardList.push(new Card(23, 5, 1, "nam_tep"));
    cardList.push(new Card(22, 6, 1, "sau_tep"));
    cardList.push(new Card(21, 7, 1, "bay_tep"));
    cardList.push(new Card(20, 8, 1, "tam_tep"));
    cardList.push(new Card(19, 9, 1, "chin_tep"));

    cardList.push(new Card(27, 1, 0, "mot_bich"));
    cardList.push(new Card(35, 2, 0, "hai_bich"));
    cardList.push(new Card(34, 3, 0, "ba_bich"));
    cardList.push(new Card(33, 4, 0, "bon_bich"));
    cardList.push(new Card(32, 5, 0, "nam_bich"));
    cardList.push(new Card(31, 6, 0, "sau_bich"));
    cardList.push(new Card(30, 7, 0, "bay_bich"));
    cardList.push(new Card(29, 8, 0, "tam_bich"));
    cardList.push(new Card(28, 9, 0, "chin_bich"));

    return cardList;
}

function initPlayers(playerList) {
    playerList.push(new Player(0, "King", []));
    playerList.push(new Player(1, "Queen", []));
    playerList.push(new Player(2, "Baby", []));
    playerList.push(new Player(3, "Tuan", []));
    playerList.push(new Player(4, "Toan", []));
    playerList.push(new Player(5, "Tung", []));
    playerList.push(new Player(6, "Nga", []));
    playerList.push(new Player(7, "Muoi", []));
    playerList.push(new Player(8, "Van", []));
    playerList.push(new Player(9, "Huong", []));
    playerList.push(new Player(10, "PhapSu", []));
    playerList.push(new Player(11, "Bin", []));
    playerList.push(new Player(12, "Bong", []));
    playerList.push(new Player(13, "Ben", []));
    playerList.push(new Player(14, "Vau", []));
    playerList.push(new Player(15, "Giau", []));
    playerList.push(new Player(16, "Huy", []));
    playerList.push(new Player(17, "Trung", []));
    playerList.push(new Player(18, "Romeo", []));
    playerList.push(new Player(19, "Juliet", []));
    playerList.push(new Player(20, "Papa", []));
    playerList.push(new Player(21, "Cong", []));
    playerList.push(new Player(22, "David", []));
    playerList.push(new Player(23, "Tony", []));
    playerList.push(new Player(24, "Hien", []));
    playerList.push(new Player(25, "Hang", []));
    playerList.push(new Player(26, "Linh", []));
    playerList.push(new Player(27, "Beer", []));
    playerList.push(new Player(28, "Alcoho", []));
    playerList.push(new Player(29, "Tequila", []));

    return playerList;
}

function randomPlayers(playerList) {
    var shuffled = shuffle(playerList);
    playerList = shuffled.slice(0, 3);
    return playerList;
}

function randomAvatar(isEnable) {
    if (!isEnable) return "res/ava_00.png";

    var arr = ["ava_01","ava_02","ava_03","ava_04","ava_05","ava_06","ava_07",
               "ava_08","ava_09","ava_10","ava_11","ava_12","ava_13","ava_14"];
    arr = shuffle(arr);
    return "res/" + arr[0] + ".png";
}

function shuffle(arr) {
    var j, x, index;
    for (index = arr.length - 1; index > 0; index--) {
        j = Math.floor(Math.random() * (index + 1));
        x = arr[index];
        arr[index] = arr[j];
        arr[j] = x;
    }
    return arr;
}

function who_win(me, player1) {
    console.log("tuandv: compare " + me.total_points + " and " + player1.total_points);
    if (me.total_points > player1.total_points) {
        return me;
    } else if (me.total_points < player1.total_points) {
        return player1;
    } else {
        if (me.highest_card_value < player1.highest_card_value) {
            return me;
        } else {
            return player1;
        }
    }
}

function getHighestRankCard(c1, c2) {
    if (c1._rank > c2._rank) return c1;
    if (c1._rank < c2._rank) return c2;
    if (c1._suit < c2._suit) return c1;
    return c2;
}

function delay(time) {
}
