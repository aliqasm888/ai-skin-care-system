import json
import sys
import os
import traceback
sys.stdout.reconfigure(encoding='utf-8')

class SkinKBSEngine:
    def __init__(self, kb_file):
        if not os.path.exists(kb_file):
            raise FileNotFoundError(f"Knowledge base file not found: {kb_file}")

        with open(kb_file, "r", encoding="utf-8") as file:
            self.kb = json.load(file)

        if "descriptions" not in self.kb:
            raise KeyError("Missing 'descriptions' key in knowledge base")

        self.descriptions = self.kb["descriptions"]

        self.scores = {
            "oily": 0.0,
            "dry": 0.0,
            "combination": 0.0,
            "normal": 0.0
        }

    def combine_cf(self, cf1, cf2):
        if cf1 >= 0 and cf2 >= 0:
            return cf1 + cf2 * (1 - cf1)
        elif cf1 < 0 and cf2 < 0:
            return cf1 + cf2 * (1 + cf1)
        else:
            return (cf1 + cf2) / (1 - min(abs(cf1), abs(cf2)))

    def apply_score(self, score_dict):
        for skin_type, score in score_dict.items():
            if skin_type not in self.scores:
                raise KeyError(f"Invalid skin type in score: {skin_type}")

            current = self.scores[skin_type]
            self.scores[skin_type] = self.combine_cf(current, score)

    def process_step(self, node_name, user_answer):
        if node_name not in self.kb:
            raise KeyError(f"Node '{node_name}' not found in knowledge base")

        node = self.kb[node_name]

        if user_answer is None or user_answer == "":
            return {
                "type": "question",
                "node": node_name,
                "question": node["question"],
                "options": list(node["options"].keys()),
                "scores": self.scores
            }

        if user_answer not in node["options"]:
            return {
                "type": "error",
                "message": "Invalid answer option",
                "node": node_name
            }

        selected = node["options"][user_answer]
        self.apply_score(selected["score"])
        next_node = selected["next"]

        if next_node.endswith("_skin") or next_node == "end":
            final_skin = max(self.scores, key=self.scores.get)

            return {
                "type": "result",
                "skin": final_skin,
                "description": self.descriptions.get(final_skin, "No description found"),
                "scores": self.scores
            }

        if next_node not in self.kb:
            raise KeyError(f"Next node '{next_node}' not found")

        next_question = self.kb[next_node]

        return {
            "type": "question",
            "node": next_node,
            "question": next_question["question"],
            "options": list(next_question["options"].keys()),
            "scores": self.scores
        }


# ---------------- ENTRY POINT ----------------

if __name__ == "__main__":
    try:
        # ✅ تأكد أن في argument
        
        if len(sys.argv) < 2:
            raise ValueError("No JSON input provided to script")

        raw_input = sys.argv[1]

        if not raw_input.strip():
            raise ValueError("Empty JSON input")

        # ✅ parse input
        data = json.loads(raw_input)

        node = data.get("node", "start_question")
        answer = data.get("answer")

        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        KB_PATH = os.path.join(BASE_DIR, "../kbs-data/knowledge_base_ar.json")

        engine = SkinKBSEngine(KB_PATH)
        result = engine.process_step(node, answer)

        # ✅ اطبع JSON صالح فقط
        print(json.dumps(result, ensure_ascii=False))

    except Exception as e:
        # ✅ اطبع الخطأ في stderr (للتشخيص)
        print("PYTHON ERROR:", str(e), file=sys.stderr)
        traceback.print_exc(file=sys.stderr)

        # ✅ ارجع JSON منظم للـ Node
        print(json.dumps({
            "type": "error",
            "message": str(e)
        }, ensure_ascii=False))