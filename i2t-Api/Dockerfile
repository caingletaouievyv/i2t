# -------------------
# Build stage (compile app)
# -------------------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY i2t-Api/*.csproj ./
RUN dotnet restore "i2t-Api.csproj"

COPY i2t-Api/. ./
RUN dotnet publish "i2t-Api.csproj" -c Release -o /app/publish

# Runtime stage (snippet)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# install runtime deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr libtesseract-dev libleptonica-dev hunspell hunspell-en-us \
    && rm -rf /var/lib/apt/lists/*

# copy published app from build stage
COPY --from=build /app/publish .

# Copy tessdata/dicts as you already do
COPY i2t-Api/tessdata /app/tessdata
COPY i2t-Api/Dictionaries /app/Dictionaries
ENV TESSDATA_PREFIX=/app/tessdata

# Ensure platform probing folders exist and copy the lib where Interop expects
RUN mkdir -p /app/x64 /app/x86 \
 && REAL=$(find /usr/lib /usr/local/lib -maxdepth 2 -name "liblept.so*" | head -n1) \
 && echo "Using $REAL" \
 && cp -f "$REAL" /app/libleptonica-1.82.0.so \
 && cp -f "$REAL" /app/x64/libleptonica-1.82.0.so \
 && cp -f "$REAL" /app/x86/libleptonica-1.82.0.so \
 && chmod 755 /app/libleptonica-1.82.0.so /app/x64/libleptonica-1.82.0.so /app/x86/libleptonica-1.82.0.so

ENV LD_LIBRARY_PATH=/app:/app/x64:$LD_LIBRARY_PATH

ENTRYPOINT ["dotnet", "i2t-Api.dll"]
