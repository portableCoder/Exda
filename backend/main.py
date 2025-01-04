from traceback import print_stack
from dotenv import load_dotenv

load_dotenv()
import json
from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from flask_cors import CORS
from ai import model

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # enable cors

csv_df, csv_out_df = None, None


@app.route("/generate-data", methods=["POST"])
def gemini_chat():
    try:
        # Parse request data

        file = request.files["csv"]
        data = json.loads(request.form.get("data"))
        if not file:
            return jsonify({"error": "Missing csv file in request body"}), 400
        if not data:
            return jsonify({"error": 'Missing "data" field in request body'}), 400
        # Ensure messages is a list of dicts with expected structure
        messages: list = data

        if not isinstance(messages, list) or not all(
            isinstance(m, dict) and "role" in m and "content" in m for m in messages
        ):
            return (
                jsonify(
                    {
                        "error": '"data" must be an array of dicts with "role" and "content" fields'
                    }
                ),
                400,
            )
        global csv_df, csv_out_df
        csv_df = pd.read_csv(file.stream)
        table_description = extract_header_info(csv_df)
        print(table_description)

        history = []
        for i in range(0, len(data) - 1):
            msg = data[i]
            content = msg["content"]
            role = msg["role"]
            history.append(
                {"role": "model" if role == "ai" else "user", "parts": [content]}
            )

        history.append(
            {
                "role": "user",
                "parts": [
                    f"""
                                           TABLE DESCRIPTION:
                                           {table_description}
                                           USER REQUEST:
                                           {data[-1]['content']}
                                           """
                ],
            }
        )

        chat = model.start_chat(history=history)
        response = chat.send_message("<start generating the request>")
        print(response.text)
        response_ob = json.loads(
            response.text.replace("```json", "\n").replace("```", "\n")
        )
        code = response_ob["code"]
        print("code:", code)
        last_msg = {"role": "ai"}
        if code:
            exec(code, globals())
            last_msg["table"] = csv_out_df.to_dict(orient="split")
            print(last_msg["table"])

        last_msg["content"] = response_ob["message"]
        messages.append(last_msg)
        print(messages)
        # Return Gemini's response
        return jsonify({"messages": messages}), 200
    except Exception as e:
        print(e)
        print_stack()
        return jsonify({"error": str(e)}), 500


def extract_header_info(df):
    # Read the CSV into a DataFrame

    # Detect columns with "date" (case-insensitive) in their names
    date_columns = [col for col in df.columns if "date" in col.lower()]

    # Attempt to convert these columns to datetime
    for col in date_columns:
        df[col] = pd.to_datetime(df[col], errors="ignore")

    # Convert other object columns to string if they contain text
    for col in df.select_dtypes(include=["object"]).columns:
        if col not in date_columns:  # Avoid reconverting already processed date columns
            df[col] = df[col].astype("string")

    # Generate header information with refined data types
    header_info = " | ".join([f"{col} <{df[col].dtype}>" for col in df.columns])
    return header_info


if __name__ == "__main__":
    app.run(debug=True)
